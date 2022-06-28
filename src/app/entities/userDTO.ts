export class UserDTO{
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phoneNumber: string;

  constructor(id: number, firstName: string, lastName: string, gender: string,
              email: string, phoneNumber: string){
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.email = email;
    this.phoneNumber = phoneNumber;
  }
}
