import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    forwardRef,
    Inject
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ClassCreateDto } from "./dto/ClassCreate.dto";
import { ClassUpdateDto } from "./dto/ClassUpdate.dto";
import { ClassSearchDto } from "./dto/ClassSearch.dto";
import { StudentToClassDto } from "./dto/StudentToClass.dto";
import { Class, ClassDocument } from "./class.schema";
import { UserDocument } from "../users/user.schema";
import { Role } from "../users/dto/UserRole.dto";
import { TeacherToClassDto } from "./dto/AssignTeacherToClass.dto";
import { UserRepository } from "../users/user.repository";

@Injectable()
export class ClassRepository {
    constructor(
        @InjectModel(Class.name) private classModel: Model<ClassDocument>,
        @Inject(forwardRef(() => UserRepository))private readonly userModel: Model<UserDocument>
    ) { }
    //Create a class, and if already exists a class with the same name, return an error
    async create(classCreateDto: ClassCreateDto): Promise<void> {
        try {
            new this.classModel(classCreateDto).save();
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException( "Class with this name already exists!" );
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    //Find all the classes and populate the table with the data of the teacher and students
    async findAll() {
        return await this.classModel.find().populate("teacher students");
    }

    //Find with filters (name, description, startDate or endDate)
    async findWithFilters(filter: ClassSearchDto) {
        const name = Object.is(filter.name, undefined) ? "" : filter.name;
        const description = Object.is(filter.description, undefined)
            ? ""
            : filter.description;
        const startDate = Object.is(filter.startDate, undefined)
            ? ""
            : filter.startDate;
        const endDate = Object.is(filter.endDate, undefined)
            ? ""
            : filter.endDate;

        return await this.classModel
            .find({
                $and: [
                    {
                        name: {
                            $regex: name,
                        },
                    },
                    {
                        description: {
                            $regex: description,
                        },
                    },
                    {
                        startDate: {
                            $regex: startDate,
                        },
                    },
                    {
                        endDate: { $regex: endDate },
                    },
                ],
            })
            .populate("teacher students")
            .exec();
    }

    async delete(classSearchDto: ClassUpdateDto): Promise<void> {
        const result = await this.classModel
            .findOneAndDelete({ name: classSearchDto.name, })
            .exec();

        if (!result) {
            throw new NotFoundException(`Class with ID not found`);
        }
    }

    async update(classUpdateDto: ClassUpdateDto): Promise<void> {
        const result = await this.classModel.findOneAndUpdate(
            { name: classUpdateDto.name },
            {
                name: classUpdateDto.name,
                description: classUpdateDto.description,
                startDate: classUpdateDto.startDate,
                endDate: classUpdateDto.endDate,
            },
            {
                new: true,
            }
        );
        if (!result) {
            throw new NotFoundException(`Class with ID not found`);
        }
    }

    async assignStudentsToClass(
        classSearchDto: StudentToClassDto
    ): Promise<void> {
        const { name, newStudents } = classSearchDto;
        try {
            const findStudent = await this.userModel.findOne({
                email: newStudents,
                role: Role.Student,
            });

            if (!findStudent) {
                throw new NotFoundException(`User with ID not found`);
            }

            const res = await this.classModel.findOneAndUpdate(
                { name: name },
                { $addToSet: { students: findStudent._id } }
            );
            if (!res) {
                throw new NotFoundException(`User with ID not found`);
            }
        } catch (err) {
            throw new NotFoundException(err.message);
        }
    }
    async removeStudentsFromClass(
        classSearchDto: StudentToClassDto
    ): Promise<void> {
        const { name, newStudents } = classSearchDto;
        try {
            const findStudent = await this.userModel.findOne({
                email: newStudents,
                role: Role.Student,
            });

            if (!findStudent) {
                throw new NotFoundException(`User with ID not found`);
            }
            const res = await this.classModel.findOneAndUpdate({ name: name },
                { $pull: { students: findStudent._id } });
            if (!res) {
                throw new NotFoundException(`User with ID not found`);
            }
        } catch (err) {
            throw new NotFoundException(err.message);
        }
    }

    async assignTeacherToClass(
        classSearchDto: TeacherToClassDto
    ): Promise<void> {
        const { name, teacher } = classSearchDto;
        try {
            const findTeacher = await this.userModel.findOne({
                email: teacher,
                role: Role.Teacher,
            });

            if (!findTeacher) {
                throw new NotFoundException(`User with ID not found`);
            }

            const res = await this.classModel.findOneAndUpdate(
                { name: name },
                { teacher: findTeacher._id }
            );
            if (!res) {
                throw new NotFoundException(`User with ID not found`);
            }
        } catch (err) {
            throw new NotFoundException(err.message);
        }
    }
    async removeTeacherFromClass(
        classSearchDto: TeacherToClassDto
    ): Promise<void> {
        const { name, teacher } = classSearchDto;
        try {
            const findTeacher = await this.userModel.findOne({
                email: teacher,
                role: Role.Teacher,
            });

            if (!findTeacher) {
                throw new NotFoundException(`User with ID not found`);
            }
            const res = await this.classModel.findOneAndUpdate({ name: name },
                { teacher: null });
            if (!res) {
                throw new NotFoundException(`User with ID not found`);
            }
        } catch (err) {
            throw new NotFoundException(err.message);
        }
    }

    async getNrClasses() {
        const response = await this.classModel.count();
        console.log(response);
        return response;
    }

    async getClassByUser() {
        const response = await this.userModel.aggregate([
            {
                $lookup: {
                    from: "classes",
                    localField: "_id",
                    foreignField: "students",
                    as: "classes",
                },
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            {
                                $arrayElemAt: ["$classes", 0],
                            },
                            "$$ROOT",
                        ],
                    },
                },
            },
            {
                $project: {
                    " _id ": 1,
                    " email ": 1,
                    " password ": 1,
                    " firstName ": 1,
                    " lastName ": 1,
                    " role ": 1,
                    " status ": 1,
                    "classes.name": 1,
                    "classes._id": 1,
                },
            },
        ]);
        return response;
    }
}
