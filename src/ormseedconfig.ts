import { DataSource } from 'typeorm'
import ormconfig from '@app/ormconfig'

const ormseedconfig = new DataSource({
	...ormconfig,
	migrations: [__dirname + '/seeds/**/*{.ts,.js}']
})

export default ormseedconfig
