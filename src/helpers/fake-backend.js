/* eslint-disable no-console */
import axios from "axios";

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users'));


export function configureFakeBackend() {

    let realFetch = window.fetch;
    window.fetch = function (url, opts) {

        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
       

                // authenticate
                if (url.endsWith('/users/authenticate') && opts.method === 'POST') {
                    // get parameters from post request
                    let params = JSON.parse(opts.body);

                    axios.defaults.headers.common[
                        "Authorization"
                      ] =  '';

                    axios
                    .post("http://localhost:3000/en/auth", {
                      username: params.email,
                      password: params.password,
                    })
                    .then((res) => {
                        let user = res.data;
                      
                        axios.defaults.headers.common[
                            "Authorization"
                          ] =  `Bearer `+user.token;

                         
                    axios.get("/users/current_user").then(response=> {
                           if (response.data.current_user.user_role.role_group.name != "Owner") 
                        axios.get("/companies/"+response.data.current_user.company_id) .then(function (responseC) {
                        let logo  =    responseC.data.company.company_logo ? responseC.data.company.company_logo.uuid:false




                        // handle success
                        const responseJson = {
                            id: response.data.current_user.id,
                            first_name: response.data.current_user.first_name,
                            last_name: response.data.current_user.last_name,
                            username: response.data.current_user.username,
                            email: response.data.current_user.email,
                            phone: response.data.current_user.phone_number,
                            token: user.token,
                            role_id :response.data.current_user.user_role.id,
                            role_group :response.data.current_user.user_role.role_group.name,
                            company_id: response.data.current_user.company_id,
                            company_logo: logo

                        };
                        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(responseJson)) });

                        // eslint-disable-next-line no-unused-vars
                        })

                         else    {
                             
                        // handle success
                        const responseJson = {
                            id: response.data.current_user.id,
                            first_name: response.data.current_user.first_name,
                            last_name: response.data.current_user.last_name,
                            username: response.data.current_user.username,
                            email: response.data.current_user.email,
                            phone: response.data.current_user.phone_number,
                            token: user.token,
                            role_id :response.data.current_user.user_role.id,
                            role_group :response.data.current_user.user_role.role_group.name,
                            company_id: response.data.current_user.company_id,
                            company_logo: false

                        };
                        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(responseJson)) });
                         }


                      })
                  

                      
                    }) .catch(function (error) {
                          reject(error)  
                    })


                    return;
                }

                // get users
                if (url.endsWith('/users') && opts.method === 'GET') {
                    // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                    if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {
                        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(users)) });
                    } else {
                        // return 401 not authorised if token is null or invalid
                        reject('Unauthorised');
                    }

                    return;
                }

                // get user by id
                if (url.match(/\/users\/\d+$/) && opts.method === 'GET') {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {
                        // find user by id in users array
                        let urlParts = url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);
                        let matchedUsers = users.filter(user => { return user.id === id; });
                        let user = matchedUsers.length ? matchedUsers[0] : null;

                        // respond 200 OK with user
                        resolve({ ok: true, text: () => JSON.stringify(user) });
                    } else {
                        // return 401 not authorised if token is null or invalid
                        reject('Unauthorised');
                    }

                    return;
                }

                // register user
                if (url.endsWith('/users/register') && opts.method === 'POST') {
                    // get new user object from post body
                    let newUser = JSON.parse(opts.body);
                    // validation
                    let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
                    if (duplicateUser) {
                        reject("Username '" + newUser.username + "' is already taken");
                        return;
                    }

                    // save new user
                    newUser.id = users.length ? Math.max(...users.map(user => user.id)) + 1 : 1;
                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));

                    // respond 200 OK
                    resolve({ ok: true, text: () => Promise.resolve() });

                    return;
                }

                // pass through any requests not handled above
                realFetch(url, opts).then(response => resolve(response));

        
        });
    }
}