import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { UserCreateDto } from "./dto/UserCreate.dto";
import { User, UserDocument } from "./user.schema";
import { UserUpdateDto } from "./dto/UserUpdate.dto";
import { UserSearchDto } from "./dto/UserSearch.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>, 
    ) { }

    async create(userCreatedto: UserCreateDto): Promise<void> {
        //hash the password and the store in db
        const { email, password, status, role, firstName, lastName, phone } =
            userCreatedto;

        const salt = await bcrypt.genSalt(); //generate a salt
        const hashedPassword = await bcrypt.hash(password, salt); //hash the password with the salt
        try {
            await new this.userModel({
                email: email.toLowerCase(),
                password: hashedPassword,
                status,
                role,
                firstName: firstName
                    .charAt(0)
                    .toUpperCase()
                    .concat(firstName.substring(1).toLowerCase()),
                lastName: lastName
                    .charAt(0)
                    .toUpperCase()
                    .concat(lastName.substring(1).toLowerCase()),
                phone,
            }).save();
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException("Username already exists!");
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async findAll(): Promise<User[]> {
        return await this.userModel.find();
    }

    async findOne(id: string): Promise<User> {
        if (mongoose.Types.ObjectId.isValid(id)) {
            return await this.userModel.findOne({ _id: id });
        }
        return null;
    }

    async findWithFilters(filter: UserSearchDto) {
        const email = Object.is(filter.email, undefined) ? '' : filter.email;
        const role = Object.is(filter.role, undefined) ? '' : filter.role;
        const status = Object.is(filter.status, undefined) ? '' : filter.status;
        return await this.userModel.find({
            $and: [
                {
                    email: { $regex: email },
                },
                {
                    role: { $regex: role },
                },
                {
                    status: { $regex: status },
                },
            ],
        });
    }

    async findEmail(email: string): Promise<User | undefined> {
        return this.userModel.findOne({ email: email });
    }
    async update(user: UserUpdateDto): Promise<void> {
        const newUser = Object.fromEntries(
            Object.entries(user).filter(([_, v]) => v !== null && v !== "")
        );

        const result = await this.userModel.findOneAndUpdate(
            { email: user.email },
            {
                ...newUser,
            },
            {
                new: true,
            }
        );
        if (!result) {
            throw new NotFoundException(`User with ID not found`);
        }
    }

    async delete(user: UserUpdateDto): Promise<void> {
        const result = await this.userModel.findOneAndDelete({
            email: user.email,
        });
        if (!result) {
            throw new NotFoundException(`User with ID not found`);
        }
    }

    async getNrUsers(user: UserSearchDto) {
        const response = await this.userModel.find({ role: user.role }).count();
        return response;
    }
}
