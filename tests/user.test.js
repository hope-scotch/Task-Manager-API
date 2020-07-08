const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user.js')
const {userOneId, userOne, setupDatabase} = require('./fixtures/db')

// jest global function
beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    
    // The test code requests for the same things using the same http protocols as the client would
    const response = await request(app).post('/users').send({
        name: 'Sayantan',
        email: 'sayantan.biswas7653@gmail.com',
        password: 'Rook7653'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response (multiple properties)
    // expect(response.body.user.name).toBe('Sayantan')
    expect(response.body).toMatchObject({ // The properties mentioned MUST be REQUIRED on the response object
        user: {
            name: 'Sayantan',
            email: 'sayantan.biswas7653@gmail.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('Rook7653')
}, 4000) 

test('Should login existing user', async () => {

    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOne._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non-existent user', async () => {

    await request(app).post('/users/login').send({
        email: 'sayantan@example.com',
        password: 'Rook7653'
    }).expect(400)
})

test('Should get profile for user', async () => {

    console.log(userOneId)
    console.log(userOne.tokens[0].token)
    await request(app)
        .get('/users/me')
        .set('Authorization', userOne.tokens[0].token) // auth
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {

    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete user account', async () => {

    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOne._id)
    expect(user).toBeNull()
})

test('Should not delete unauthenticated user account', async () => {

    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {

    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200) 

    const user = await User.findById(userOne._id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {

    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Jess',
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Jess')
})

test('Should not update invalid user fields', async () => {

    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Kolkata',
        })
        .expect(400)
})


/***** math.js 
 * const calcTip = (total, tipPercent = .25) => total + (total * tipPercent)

const fahrenheitToCelsius = (temp) => {
    return (temp - 32) / 1.8
}

const celsiusToFahrenheit = (temp) => {
    return (temp * 1.8) + 32
}

const add = (a, b) => {
    return new Promise( (resolve, reject) => {
        setTimeout( () => {
            if (a < 0 || b < 0) 
                return reject('Numbers must be non-negative')

            resolve(a + b)
        }, 2000)
    })
}


module.exports = {
    calcTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    add
}

*/

/******* math.test.js 
 * // .test extension confirms that jest knows that this is the test file

const { calcTip, celsiusToFahrenheit, fahrenheitToCelsius, add } = require('../src/math.js')

// We don't require test() but jest allows it to declare it as a global
/* test('Hello Test', () => {
    // If test() throws an error, test case fails
})

test('Failure', () => {
    throw new Error('Failure')
}) 

// Why test?

/**
 * Saves time
 * Creates reliable software
 * Gives flexibility to developers
 *  - Refactoring
 *  - Collaborating
 *  - Profiling
 * Peace of Mind
 

test('Should calculate total with tip', () => {
    const total = calcTip(10, .3)

    expect(total).toBe(13) // toBe checks for equality -> expect is a library provided by JEST
    // Returns Expected and Received on the total var
    // expect helps us make assertions
    
    // if (total != 13)
    //    throw new Error(`Total tip should be 13. Got ${total}`)
})


test('Should calculate total with default tip', () => {
    const total = calcTip(10)
    expect(total).toBe(12.5)
})

/*test('Should convert Celsius to Fahrenheit', () => {
    const temp = celsiusToFahrenheit(0)
    expect(temp).toBe(32)
})

test('Should convert Fahrenheit to Celsius', () => {
    const temp = fahrenheitToCelsius(32)
    expect(temp).toBe(0)
})

/* test('Async test demo', (done) => {
    
    // jest didn't know our code contained async func -> By the time the function was done executing, no error was thrown
    setTimeout(() => {
        expect(1).toBe(2)
        done() // done() ensures that jest waits till our assetion is made before declaring whether it succeeded or failed
    }, 2000)
}) */
/*
test('Should add two numbers', (done) => {
    
    add(2, 3).then( (sum) => {
        expect(sum).toBe(5)
        done()
    })
})

test('Should add two numbers async/await', async () => {

    // When a function returns a promise, jest will always wait to see if the Promise is fulfilled or rejected before figuring out whether the test case is considered a success of failure
    const sum = await add(10, 22) // We don't need to use done with async-await -> again syntactical advantage
    expect(sum).toBe(32) 
}) 


*/