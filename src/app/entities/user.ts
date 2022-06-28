export class User{
    id: number;
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    phoneNumber: string;
    password: string;

    constructor(id: number, firstName: string, lastName: string, gender: string, email: string, phoneNumber: string,
                password: string){
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.gender = gender;
            this.email = email;
            this.phoneNumber = phoneNumber;
            this.password = password;
        }

}
