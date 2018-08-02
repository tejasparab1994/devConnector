import React, {Component} from 'react';
import {Card, CardBody} from 'reactstrap';

import classnames from 'classnames';
import {connect} from 'react-redux';
import {registerUser} from '../../actions/authActions';
import PropTypes from 'prop-types';
import { withRouter } from 'react-route-dom';

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

// if we get errors from the state in reducer then we will just add the props
// to the component state and continue using the same code as before
// without needing to change from pre-redux
  componentWillReceiveProps(nextProps) {
    if(nextProps.errors){

      this.setState({errors: nextProps.errors});
    }
  }

  onChange(e) {
    this.setState({
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

                <form noValidate="noValidate" onSubmit={this.onSubmit}>
                  <div className="form-group">
                    {/* is-invalid class will only exist if there is errors.name and same for others  */}
                    <input type="text" className={classnames("form-control form-control-lg",
                      {'is-invalid': errors.name})}
                      placeholder="Name"
                      name="name"
                      value={this.state.name}
                      onChange={this.onChange} />
                    {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
                  </div>
                  <div className="form-group">
                    <input type="email" className={classnames("form-control form-control-lg",
                      {'is-invalid': errors.email})}
                      placeholder="Email Address"
                      name="email" value={this.state.email}
                      onChange={this.onChange}/>
                    {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                    <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                  </div>

                  <div className="form-group">
                    <input type="password" className={classnames("form-control form-control-lg",
                      {'is-invalid': errors.password})}
                      placeholder="Password"
                      name="password"
                      value={this.state.password}
                      onChange={this.onChange}/>
                    {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                  </div>

                  <div className="form-group">
                    <input type="password"
                      className={classnames("form-control form-control-lg",
                        {'is-invalid': errors.password2})}
                      placeholder="Confirm Password"
                      name="password2"
                      value={this.state.password2}
                      onChange={this.onChange}/>
                    {errors.password2 && (<div className="invalid-feedback">{errors.password2}</div>)}
                  </div>

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

// first argument of connec tis mapStateToProps while the second argument is
// mapDispatchToProps
// we added withRouter to redirect in the authAction.js
export default connect(mapStateToProps, {registerUser})(withRouter(Register));
