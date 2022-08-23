import { IsString, IsDate, IsBoolean } from "class-validator";

class SummaryDto {
    @IsString()
    name: string;
    @IsString()
    description: string;
    @IsDate()
    date: string;
    @IsBoolean()
    presence: boolean;
    @IsString()
    justification: string;
    evaluation: {
        name: string;
        endDate: string;
        deliverWork: string[];
    };
}

export default SummaryDto;
