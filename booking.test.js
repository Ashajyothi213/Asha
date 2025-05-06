
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const baseUrl = 'https://restful-booker.herokuapp.com';

let bookingId;
let token = '';

// a. Create Booking
describe('Booking API Tests', function () {
  this.timeout(10000);

  it('a) should create a new booking', async () => {
    const response = await request(baseUrl)
      .post('/booking')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        totalprice: 150,
        depositpaid: true,
        bookingdates: {
          checkin: '2023-01-01',
          checkout: '2023-01-10',
        },
        additionalneeds: 'Breakfast',
      })
      .set('Accept', 'application/json');

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('bookingid');
    expect(response.body.booking).to.have.property('firstname', 'John');

    bookingId = response.body.bookingid;
  });

  // Create Token for Auth
  before(async () => {
    const response = await request(baseUrl)
      .post('/auth')
      .send({
        username: 'admin',
        password: 'password123',
      });

    token = response.body.token;
  });

  // b. Update Booking
  it('b) should update the booking', async () => {
    const response = await request(baseUrl)
      .put(`/booking/${bookingId}`)
      .set('Content-Type', 'application/json')
      .set('Cookie', `token=${token}`)
      .send({
        firstname: 'Jane',
        lastname: 'Doe',
        totalprice: 200,
        depositpaid: false,
        bookingdates: {
          checkin: '2023-01-05',
          checkout: '2023-01-15',
        },
        additionalneeds: 'Dinner',
      });

    expect(response.status).to.equal(200);
    expect(response.body.firstname).to.equal('Jane');
  });

  // c. Get Booking
  it('c) should retrieve the booking details', async () => {
    const response = await request(baseUrl)
      .get(`/booking/${bookingId}`)
      .set('Accept', 'application/json');

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('firstname', 'Jane');
  });

  // d. Delete Booking
  it('d) should delete the booking', async () => {
    const response = await request(baseUrl)
      .delete(`/booking/${bookingId}`)
      .set('Cookie', `token=${token}`);

    expect(response.status).to.equal(201);
  });
});
