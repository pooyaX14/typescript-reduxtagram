import React from 'react';
import { Link, withRouter, RouteComponentProps, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import '../../../App.css';
// import {isEmailAvailable} from '../../../helpers/api';
import { doesEmailExist } from '../store/actions';
import {register, User} from '../store/actions';
import { 
  validateName,
  validateUsername,
  validatePassword,
  comparePasswords,
  validateForm,
  validateEmail,
} from '../../../helpers/formValidations';
import { UserFieldInfo, FormErrors, RegistrationFormProps } from "../store/types"; 
import { StateProps } from '../../../store/types';
//import selectors
import { getRegistrationStateProps } from '../store/selectors';
import { getSessionStateProps } from '../../../store/selector'


interface StateType {
  formErrors: FormErrors;
  user: UserFieldInfo;
}

interface ActionProps {
  register: (user: User) => any;
  doesEmailExist: (email: string) => void;
}

interface DataProps {
  formErrors: FormErrors;
  status: {
    success?: string,
    failure?: string,  
  }
  emailExists: boolean;
  isLoggedIn: boolean;
}

type Props = DataProps & ActionProps;

class RegisterPage extends React.Component<Props, StateType> {
    constructor(props: Props) {
        super(props);

        this.state = {
          user: {
            firstName: '',
            username: '',
            password: '',
            confirmPass: '',
            email: '',
          },
          formErrors: {},
        };
    }
    componentDidUpdate(previousProps: Props) {
      const { formErrors } = this.props;
      if(previousProps.formErrors !== formErrors) {
        this.setState({
          formErrors: formErrors
        });
      }
    }

    handleChange = (event: any) => {
        const { name, value } = event.target;
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    handleFirstName = (event: any) => {
      //get firstName from the state;
      const { firstName } = this.state.user;
      //get errors object from the state;
      const { formErrors } = this.state;
      //Run validations to see if firstName has atleast 2 chars.
      const nameError = validateName(firstName);
      if (nameError) {
        this.setState({
          formErrors: {
            ...formErrors,
            firstName: nameError
          }
        });
      } else {
        delete formErrors.firstName;
        this.setState({
          formErrors: formErrors,
        })
        // this.setState({
        //   formErrors: {
        //     ...formErrors,
        //     firstName: ''
        //   }
        // })
      } 
    }

    handlePassword = () => {
      const { password, confirmPass } = this.state.user;
      const { formErrors } = this.state;

      const passError = validatePassword(password)
      if (passError) {
        this.setState({
          formErrors: {
            ...formErrors,
            password: passError
          }
        });
      } else {
        delete formErrors.password;
        this.setState({
          formErrors: formErrors
        })
        // this.setState({
        //   formErrors: {
        //     ...formErrors,
        //     password: ''
        //   }
        // })
      } 
    }
    handleComparePassword = () => {
      const { password, confirmPass } = this.state.user;
      const { formErrors } = this.state;
      
      const confirmPassError = comparePasswords(password, confirmPass)
      if (confirmPassError) {
        this.setState({
          formErrors: {
            ...formErrors,
            confirmPassword: confirmPassError
          }
        });
      } else {
        delete formErrors.confirmPassword;
        this.setState({
          formErrors: formErrors
        })
      } 
    }

    handleUsername= () => {
      const { username } = this.state.user;
      const { formErrors } = this.state;
      const usernameError = validateUsername(username)
      if (usernameError) {
        this.setState({
          formErrors: {
            ...formErrors,
            username: usernameError
          }
        });
      }
       else {
        delete formErrors.username;
        this.setState({
          formErrors: formErrors
        })
      } 
    }

    handleEmail = async() => {
      const { formErrors } = this.state;
      const { email } = this.state.user;

      const emailError = validateEmail(email);
      if (emailError) {
        this.setState({
          formErrors: {
            ...formErrors,
            email: emailError
          }
        });
      } else{
        this.props.doesEmailExist(email);
      }
    }

    handleSubmit = ()  => {

      const { user } = this.state;
      const { emailExists } = this.props;
      const errors = validateForm(user);
      console.log(errors)
      if((Object.entries(errors).length === 0 && errors.constructor === Object) && emailExists === false) {
        this.props.register({
          firstName: user.firstName,
          username: user.username,
          password: user.password,
          email: user.email
        });
        this.clear();
      }
      else if( emailExists === true && errors) {
        console.log("errors inside second if", errors)
        this.setState({
          // formErrors: errors,
          formErrors: {
            ...errors,
            email: "This email is already registered with another account."
          }
        });
      }
      else if(errors) {
        console.log(errors)
        this.setState({
          // formErrors: errors,
          formErrors: {
            ...errors,
          }
        });
      }
    }

    clear = () => {
      this.setState({
        user: {
          firstName: '',
          username: '',
          email: '',
          password: '',
          confirmPass: ''
        },
        formErrors: {},
      })
    }

  render() {
      const { user, formErrors } = this.state;
        return (
          (this.props.isLoggedIn === true) ? <Redirect to='/' /> : 
            <div>
                <h2 style={{textAlign: "center"}}>New User? Register here!</h2>
                <div className="center-form">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input  
                        className="form-control" 
                        type="text" 
                        name="firstName" 
                        value={user.firstName} 
                        onBlur={this.handleFirstName}
                        onChange={this.handleChange}>
                    </input>
                    <div> {formErrors ? formErrors.firstName : null} </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input  
                        className="form-control"
                        type="text" 
                        name="username" 
                        value={user.username} 
                        onBlur={this.handleUsername}
                        onChange={this.handleChange}>
                    </input>
                    <div> {formErrors ? formErrors.username : null} </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input  
                        className="form-control" 
                        type="email" 
                        name="email" 
                        value={user.email} 
                        onBlur={this.handleEmail}
                        onChange={this.handleChange}>
                    </input>
                    <div> {formErrors ? formErrors.email : null} </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input  
                        className="form-control"
                        type="password" 
                        name="password" 
                        value={user.password} 
                        onBlur={this.handlePassword}
                        onChange={this.handleChange}>
                    </input>
                    <div> {formErrors ? formErrors.password : null} </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPass">Confirm password</label>
                    <input  
                        className="form-control"
                        type="password" 
                        name="confirmPass" 
                        value={user.confirmPass}
                        onBlur={this.handlePassword} 
                        onChange={this.handleChange}>
                    </input>
                    <div> {formErrors ? formErrors.confirmPassword : null} </div>
                  </div>
                  <div className="form-group">
                      <button className="btn btn-primary"  onClick={this.handleSubmit}>Register</button>
                      <Link to="/login" className="btn btn-link">Login</Link> 
                  </div>
                </div>
            </div>
        );
    }
}
function mapStateToProps(state: StateProps){
   return {
    status: getRegistrationStateProps(state).status,
    emailExists: getRegistrationStateProps(state).emailExists,
    formErrors: getRegistrationStateProps(state).formErrors,
    isLoggedIn: getSessionStateProps(state).isLoggedIn,
  }
}
export default connect(mapStateToProps, {
  register: register,
  doesEmailExist: doesEmailExist
})(RegisterPage);