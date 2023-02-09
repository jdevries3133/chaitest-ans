# 2/8 Mentoring Session

On 2/8, we did a little interactive demo of testing with chai.

For the folks who attended, here is the work we did as a reference. First, we
defined the `/add` API method.

```javascript
app.post('/add', (req, res) => {
  const { a, b } = req.body
  res.send({ sum: a + b });
})
```

Then, we defined a few basic tests. Then, we tried to figure out some tests
that would cause a server-side 500 error. Aboubacar identified the key test
that broke the sever: trying to call the API without providing the `a` input.
Eventually, we realized that in general, calling the API without an input broke
the backend.

```javascript
it('is resilient against not getting any data', () => {
  chai.request(app)
  .post('/add')
  .send({})
  .end((_, res) => {
    res.body.sum.should.equal(0)
  })
})
```

We then used our test suite to improve and refactor our code. At first, the
function accepted wonky inputs, like booleans and string arrays. The naive
implementation even provided the result of `1, 2, 34, 3, 4` for the array
adding case – try to figure that one out!

We updated our tests to not support the use-cases that we thought were weird,
like adding booleans. We also updated our test in the array-adding scenario so
that the API returns the sum of each of the arrays of numbers.

At that point, we had a nice test suite, and used the test suite to improve our
function until it passed tests.

By the end of this process, the function was pretty ugly:


```javascript
app.post('/add', (req, res) => {
  let { a, b } = req.body;

  // GOal:is resilient against not getting any data
  if (a === false || b === false ) {
    res.status(400).send({ message: 'cannot provide empty inputs' });
    return
  }


  // Goal: returns 400 if it recieves boolean inputs


  // To validate `a`, I need to make sure that `a` is not a boolean
  const isANotValid = typeof a === 'boolean';
  // OR
  // To validate `b`, I need to make sure that `b` is not a boolean
  const isBNotValid = typeof b === 'boolean';
  //
    // If either of those things are true, I will send a 400 erorr
  if (isANotValid || isBNotValid) { /* note: this is a "guard clause" */
    res.status(400).send({ message: 'boolean inputs are unacceptable' });
    return
  }

  if (a instanceof Array) {
    a = a.reduce((acc, cur) => acc + cur);
  }
  if (b instanceof Array) {
    b = b.reduce((acc, cur) => acc + cur);
  }
  res.send({ sum: a + b });
})
```

Through the [red-green
refactor](https://www.codecademy.com/article/tdd-red-green-refactor) strategy,
we cleaned up our messy code:

```javascript
app.post('/add', ({ body: { a, b }}, res) => {
  // we will coerce null or undefined inputs to 0
  if (
    a === undefined
    || b === undefined
    || a === null
    || b === null
  ) {
    res.send({ sum: 0 });
    return
  }
  // we will not accept boolean inputs
  if (typeof a === 'boolean' || typeof b === 'boolean') {
    res.status(400).send({ message: 'boolean inputs are unacceptable' });
    return
  }
  // for array inputs, we will sum the array (i.e [1, 2] -> 3)
  if (a instanceof Array) {
    a = a.reduce((acc, cur) => acc + cur);
  }
  if (b instanceof Array) {
    b = b.reduce((acc, cur) => acc + cur);
  }

  res.send({ sum: a + b });
})
```
