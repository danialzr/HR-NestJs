import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { TransformResponseInterceptor } from "src/common/interceptors/transform-response.interceptor";
import { DataSource } from "typeorm";
import * as bcrypt from 'bcrypt'
import { User } from "src/modules/auth/entities/user.entity";
import { Role } from "src/shared/enums/user-role.enum";


describe('Attendance (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let employeeToken: string;
    let employeeId: number;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalInterceptors(new TransformResponseInterceptor())
        app.enableCors({
            origin: true,
            credentials: true
        })
        app.setGlobalPrefix('api/v1')

        dataSource = moduleFixture.get<DataSource>(DataSource);
        await app.init();

        const employeeMobile = '09100000000';
        const employeePassword = '123456';
        const passwordHashed = await bcrypt.hash(employeePassword, 12);

        const employeeRepo = dataSource.getRepository(User);
        let employee = await employeeRepo.findOne({ where: { mobile: employeeMobile } });
        if (!employee) {
            employee = employeeRepo.create({
                mobile: employeeMobile,
                password: passwordHashed,
                role: Role.EMPLOYEE
            })
            employee = await employeeRepo.save(employee);
        }
    })
})