import React, {Component} from 'react';
import {Card, CardBody} from 'reactstrap';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {registerUser} from '../../actions/authActions';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // if user is logged in and goes to register page, then redirect to dashboard
  componentDidMount() {
    if(this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

// if we get errors from the state in reducer then we will just add the props
// to the component state and continue using the same code as before
// without needing to change from pre-redux
// but why would we need to change pre-redux code?
// because this way we will add the error props to component state as soon as we get
// them
  componentWillReceiveProps(nextProps) {
    if(nextProps.errors){

      this.setState({errors: nextProps.errors});
    }
  }

  onChange(e) {
    this.setState({
      // get the name of the field, by e.target, where name can be name, email,
      // password or password2 and get its corresponding values and set state
      [e.target.name]: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    // will allow us to redirect in the action using this.props.history.
    // any action we want will be available in props and we waccess it through props
    this.props.registerUser(newUser, this.props.history);
  }

  render() {

    // destructuring, which will just pattern match and get errors
    const {errors} = this.state;


    return (<div className="register">


      <div className="container">
        <Card>
          <CardBody>
            <div className="row">
              <div className="col-md-8 m-auto">

                <h5 className="display-4 text-center">Sign Up</h5>
                <p className="lead text-center">Create your DevConnector account</p>

                {/* html5 error messages removed with noValidate */}
                <form noValidate="noValidate" onSubmit={this.onSubmit}>

                  <TextFieldGroup
                    placeholder = "Name"
                    name = "name"
                    value = {this.state.name}
                    onChange = {this.onChange}
                    error = {errors.name}
                  />

                  <TextFieldGroup
                    placeholder = "Email Address"
                    name = "email"
                    type = "email"
                    value = {this.state.email}
                    onChange = {this.onChange}
                    error = {errors.email}
                    info = "This site uses Gravatar so if you want a profile image, use a Gravatar email"
                  />

                  <TextFieldGroup
                    placeholder = "Password"
                    name = "password"
                    type = "password"
                    value = {this.state.password}
                    onChange = {this.onChange}
                    error = {errors.password}
                  />


                  <TextFieldGroup
                    placeholder = "Confirm Password"
                    name = "password2"
                    type = "password"
                    value = {this.state.password2}
                    onChange = {this.onChange}
                    error = {errors.password2}
                  />
                  

                  <input type="submit" className="btn btn-info btn-block mt-4"/>
                </form>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>);
  }
}

// any properties you have in your component should be mapped to proptypes.
// used for typechecking
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors:PropTypes.object.isRequired
}

// this puts auth state in props, so it can be accessed using props
// state.auth here since we have mentioned auth in state in reducers/index.js
// when reducers are implemented and state is updated we add that state to props
// through here.
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

// first argument of connect is mapStateToProps while the second argument is
// mapDispatchToProps
// second parameter is an object to wwhich we want to map our actions
// we added withRouter to redirect in the authAction.js from register to login page
export default connect(mapStateToProps, {registerUser})(withRouter(Register));
