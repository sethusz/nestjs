import * as dotenv from 'dotenv'
dotenv.config()
import { DataSource, DataSourceOptions } from 'typeorm'

const ormconfig: DataSourceOptions = {
	type: 'postgres',
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT, 10) || 5432,
	username: process.env.DB_USERNAME || 'mediumclone',
	password: process.env.DB_PASSWORD || '123',
	database: process.env.DB_NAME || 'mediumclone',
	synchronize: false,
	dropSchema: false,
	logging: false,
	entities: [__dirname + '/**/*.entity{.ts,.js}'],
	migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
	migrationsTableName: 'migrations'
}

export const dataSource = new DataSource(ormconfig)

export default ormconfig
