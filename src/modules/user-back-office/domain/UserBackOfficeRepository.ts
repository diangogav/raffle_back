import { UserBackOffice } from "./UserBackOffice";

export interface UserBackOfficeRepository {
	get(): Promise<UserBackOffice[]>;
}
