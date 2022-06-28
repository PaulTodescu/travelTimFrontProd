export class UserContactDTO{
  email: string;
  phoneNumber: string;

  constructor(email: string, phoneNumber: string){
    this.email = email;
    this.phoneNumber = phoneNumber;
  }
}
