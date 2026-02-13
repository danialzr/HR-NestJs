import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { TransformResponseInterceptor } from "../src/common/interceptors/transform-response.interceptor";
import { DataSource } from "typeorm";
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { User } from "../src/modules/users/entities/user.entity";
import { Role } from "../src/shared/enums/user-role.enum";
import { Attendance } from "../src/modules/attendances/entities/attendance.entity";



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

        app.useGlobalInterceptors(new TransformResponseInterceptor)

        app.enableCors({
            origin: true,
            credential: true
        })
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        app.setGlobalPrefix('api/v1')

        await app.init()
        dataSource = moduleFixture.get(DataSource);

        const employeeMobile = '09100000000';
        const employeePassword = '12345678';
        const hashedPassword = await bcrypt.hash(employeePassword, 12)

        const employeeRepo = dataSource.getRepository(User);
        let employee = await employeeRepo.findOne({ where: { mobile: employeeMobile } });
        if (!employee) {
            employee = employeeRepo.create({
                mobile: employeeMobile,
                password: hashedPassword,
                role: Role.EMPLOYEE
            });
            employee = await employeeRepo.save(employee);
        }

        employeeId = employee.id;

        const employeeLoginResponse = await request(app.getHttpServer())
            .post('/api/v1/auth/login')
            .send({
                mobile: employeeMobile,
                password: employeePassword
            });

        employeeToken = employeeLoginResponse.body.data.accessToken;
    })

    afterAll(async () => {
        const attendaceRepo = dataSource.getRepository(Attendance);
        await attendaceRepo.delete({ user: { id: employeeId } })
    })

    describe('Employee Attendance', () => {
        describe('POST /employee/attendace/check-in', () => {
            it('باید ورود را با موفقیت ثبت کند', () => {
                return request(app.getHttpServer())
                    .post('/employee/attendance/check-in')
                    .set('Authorization', `Bearer ${employeeToken}`)
                    .send({
                        notes: 'ورود تست',
                        jDate: '1404/01/01'
                    })
                    .expect(201)
            });

            it('باید ورود را با موفقیت ثبت کند', () => {
                return request(app.getHttpServer())
                    .post('/employee/attendance/check-in')
                    .set('Authorization', `Bearer ${employeeToken}`)
                    .send({
                        notes: 'ورود تست',
                        jDate: '1404/01/02'
                    })
                    .expect(201)
            });

            it('دو ورود تکراری نباید در یک روز ثبت شود', () => {
                return request(app.getHttpServer())
                    .post('/employee/attendance/check-in')
                    .set('Authorization', `Bearer ${employeeToken}`)
                    .send({
                        notes: 'ورود تست',
                        jDate: '1404/01/02'
                    })
                    .expect(400)
            });

            it('رکورد بدون تاریخ نباید ثبت بشه', () => {
                return request(app.getHttpServer())
                    .post('/employee/attendance/check-in')
                    .set('Authorization', `Bearer ${employeeToken}`)
                    .send({
                        notes: 'ورود تست'
                    })
                    .expect(400)
            });

            it('باید خروج را با موفقیت ثبت کند', () => {
                return request(app.getHttpServer())
                    .post('/employee/attendance/check-out')
                    .set('Authorization', `Bearer ${employeeToken}`)
                    .send({
                        jDate: '1404/01/01'
                    })
                    .expect(201)
            });
        })
    })
})