const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

/*
01 - Create an issue with every field: POST request to /api/issues/{project}
02 - Create an issue with only required fields: POST request to /api/issues/{project}
03 - Create an issue with missing required fields: POST request to /api/issues/{project}
04 - View issues on a project: GET request to /api/issues/{project}
05 - View issues on a project with one filter: GET request to /api/issues/{project}
06 - View issues on a project with multiple filters: GET request to /api/issues/{project}
07 - Update one field on an issue: PUT request to /api/issues/{project}
08 - Update multiple fields on an issue: PUT request to /api/issues/{project}
09 - Update an issue with missing _id: PUT request to /api/issues/{project}
10 - Update an issue with no fields to update: PUT request to /api/issues/{project}
11 - Update an issue with an invalid _id: PUT request to /api/issues/{project}
12 - Delete an issue: DELETE request to /api/issues/{project}
13 - Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
14 - Delete an issue with missing _id: DELETE request to /api/issues/{project}
*/

suite('Functional Tests', function() {
  this.timeout(5000);
  let deleteId;
  
  // #01
  test('Create an issue with every field', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/projects')
      .set('content-type', 'application/json')
      .send({
        issue_title: 'Issue test 1',
        issue_text: 'Functional test 1',
        created_by: 'Adrian',
        assigned_to: 'fCC',
        status_text: 'Not done'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        deleteId = res.body._id;
        assert.equal(res.body.issue_title, 'Issue test 1');
        assert.equal(res.body.issue_text, 'Functional test 1');
        assert.equal(res.body.created_by, 'Adrian');
        assert.equal(res.body.assigned_to, 'fCC');
        assert.equal(res.body.status_text, 'Not done');
        done();
      })
  });

  // #02
  test('Create an issue with only required fields', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/projects')
      .set('content-type', 'application/json')
      .send({
        issue_title: 'Issue test 2',
        issue_text: 'Functional test 2',
        created_by: 'Adrian'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.issue_title, 'Issue test 2');
        assert.equal(res.body.issue_text, 'Functional test 2');
        assert.equal(res.body.created_by, 'Adrian');
        assert.equal(res.body.assigned_to, '');
        assert.equal(res.body.status_text, '');
        done();
      })
  });

  // #03
  test('Create an issue with missing required fields', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/projects')
      .set('content-type', 'application/json')
      .send({
        issue_title: '',
        issue_text: '',
        created_by: '',
        assigned_to: 'fCC',
        status_text: 'Not done'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'required field(s) missing');
        done();
      })
  });

  // #04
  test('View issues on a project', function(done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/test-data/')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.length, 2);
        done();
      });
  });

  // #05
  test('View issues on a project with one filter', function(done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/test-data/')
      .query({
        _id: '64f3783b21a1b4d50da70ede'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.length, 1);
        assert.deepEqual(res.body[0], {
          _id: "64f3783b21a1b4d50da70ede",
          issue_title: "Testing issue title",
          issue_text: "Text test",
          created_on: "2023-09-02T18:00:27.335Z",
          updated_on: "2023-09-02T18:00:27.335Z",
          created_by: "Adrian",
          assigned_to: "Wilker",
          open: true,
          status_text: ""
        });
        done();
      });
  });

  // #06
  test('View issues on a project with multiple filters', function(done) {
    chai.request(server)
      .keepOpen()
      .get('/api/issues/test-data/')
      .query({
        assigned_to: 'Adrian',
        created_by: 'Wilker'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.length, 1);
        assert.deepEqual(res.body[0], {
          _id: "64f3783b21a1b7d50da70e26",
          issue_title: "New issue for test",
          issue_text: "Testing this issue text",
          created_on:"2023-09-02T18:01:35.224Z",
          updated_on: "2023-09-02T18:01:35.224Z",
          created_by: "Wilker",
          assigned_to: "Adrian",
          open: true,
          status_text: ""
        });
        done();
      })
  });

  // #07
  test('Update one field on an issue', function(done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/test-data-put')
      .send({
        _id: '64f3783b21a1b7f50de70e27',
        issue_title: 'New PUT test updated!'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, '64f3783b21a1b7f50de70e27');
        done();
      });
  });

  // #08
  test('Update multiple fields on an issue', function(done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/test-data-put')
      .send({
        _id: '64f4783b21a2b4d50da70efd',
        issue_title: 'Testing PUT function UPDATED!',
        issue_text: 'Text updated'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, '64f4783b21a2b4d50da70efd');
        done();
      });
  });

  // #09
  test('Update an issue with missing _id', function(done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/test-data-put')
      .send({
        issue_title: 'Title updated',
        issue_text: 'Text updated too'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });

  // #10
  test('Update an issue with no fields to update', function(done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/test-data-put')
      .send({
        _id: '64f4783b21a2b4d50da70efd'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'no update field(s) sent');
        done();
      });
  });

  // #11
  test('Update an issue with an invalid _id', function(done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/test-data-put')
      .send({
        _id: '1nv4l1d1D',
        issue_title: 'Trying to update'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not update');
        done();
      });
  });

  // #12
  test('Delete an issue', function(done) {
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/projects')
      .send({
        _id: deleteId
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully deleted');
        assert.equal(res.body._id, deleteId);
        done();
      });
  });

  // #13
  test('Delete an issue with an invalid _id', function(done) {
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/projects')
      .send({
        _id: '1nv4l1d1D'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not delete');
        done();
      })
  })

  // #14
  test('Delete an issue with missing _id', function(done) {
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/projects')
      .send({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });
  
});
