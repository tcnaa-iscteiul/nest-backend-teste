import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Delete,
    Patch,
    UseGuards,
} from "@nestjs/common";
import { TeacherToClassDto } from "./dto/AssignTeacherToClass.dto";
import { ClassCreateDto } from "./dto/ClassCreate.dto";
import { ClassSearchDto } from "./dto/ClassSearch.dto";
import { ClassUpdateDto } from "./dto/ClassUpdate.dto";
import { StudentToClassDto } from "./dto/StudentToClass.dto";
import { Class } from "./class.schema";
import { ClassService } from "./class.service";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "../roleGuard/role.decorator";
import { Role } from "../users/dto/UserRole.dto";

@UseGuards(AuthGuard("jwt"))
@Controller("class")
export class ClassController {
    constructor(private classService: ClassService) {}

    @Roles(Role.Admin)
    @Post()
    async create(@Body() classCreateDto: ClassCreateDto): Promise<void> {
        return await this.classService.create(classCreateDto);
    }

    @Get("/all")
    async getAll(@Query() param: ClassSearchDto): Promise<Class[]> {
        if (Object.keys(param).length) {
            return this.classService.classSearch(param);
        } else {
            return this.classService.getAll();
        }
    }

    @Roles(Role.Admin)
    @Patch()
    async updateClass(@Body() classUpdateDto: ClassUpdateDto): Promise<void> {
        return await this.classService.update(classUpdateDto);
    }

    @Roles(Role.Admin)
    @Delete()
    async deleteClass(@Query() param: ClassUpdateDto) {
        return await this.classService.delete(param);
    }

    @Roles(Role.Admin)
    @Patch("/student")
    async assignStudentsToClass(@Body() classSearchDto: StudentToClassDto) {
        return await this.classService.assignStudentsToClass(classSearchDto);
    }

    @Roles(Role.Admin)
    @Patch("/removeStudent")
    async removeStudentsFromClass(@Body() classSearchDto: StudentToClassDto) {
        return await this.classService.removeStudentsFromClass(classSearchDto);
    }

    @Roles(Role.Admin)
    @Patch("/assign")
    async assignTeacherToClass(@Body() classSearchDto: TeacherToClassDto) {
        return await this.classService.assignTeacherToClass(classSearchDto);
    }

    @Roles(Role.Admin)
    @Patch("/remove")
    async removeTeacherFromClass(@Body() classSearchDto: TeacherToClassDto) {
        return await this.classService.removeTeacherFromClass(classSearchDto);
    }

    @Get("/nr")
    async getNrClasses() {
        return await this.classService.getNrClasses();
    }

    @Get()
    async getClassByUser() {
        return await this.classService.getClassByUser();
    }
}
