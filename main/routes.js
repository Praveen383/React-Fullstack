var express = require('express')
var router = express.Router()
var client = require('./db')


/*
    POSTS ROUTES SECTION
*/

router.get('/api/get/allposts', (req, res, next ) => {
    client.query("SELECT * FROM posts ORDER BY date_created DESC", (q_err, q_res) => {
      res.json(q_res.rows)
  })
})


// router.post('/api/post/posttodb', (req, res, next) => {
//   const values = [req.body.title, req.body.body, req.body.id, req.body.username]
//   console.log('values', values);
//   client.query(`INSERT INTO posts(title, body, user_id, author, date_created)
//               VALUES($1, $2, $3, $4, NOW() )`, values, (q_err, q_res) => {
//           if(q_err) return next(q_err);
//           res.json(q_res.rows)
//     })
// })

router.put('/api/put/post', (req, res, next) => {
  const values = [req.body.title, req.body.body, req.body.id, req.body.pid, req.body.username]
  client.query(`UPDATE posts SET title= $1, body=$2, user_id=$3, auther=$5, date_created=NOW()
              WHERE pid = $4`, values,
              (q_err, q_res) => {
                console.log(q_res)
                console.log(q_err)
        })
})

router.delete('/api/delete/postcomments', (req, res, next) => {
  const post_id = req.body.post_id
  client.query(`DELETE FROM comments
              WHERE post_id = $1`, [post_id],
              (q_err, q_res) => {
                  res.json(q_res.rows)
                  console.log(q_err)
        })
})

router.delete('/api/delete/post', (req, res, next) => {
  const post_id = req.body.post_id
  client.query(`DELETE FROM posts WHERE pid = $1`, [ post_id ],
              (q_err, q_res) => {
                res.json(q_res.rows)
                console.log(q_err)
       })
})

/*
    COMMENTS ROUTES SECTION
*/


router.post('/api/post/commenttodb', (req, res, next) => {
  const values = [ req.body.comment, req.body.user_id, req.body.username, req.body.post_id]

  client.query(`INSERT INTO comments(comment, user_id, auther, post_id, date_created)
              VALUES($1, $2, $3, $4, NOW())`, values,
              (q_err, q_res ) => {
                  res.json(q_res.rows)
                  console.log(q_err)
      })
})

router.put('/api/put/commenttodb', (req, res, next) => {
  const values = [ req.body.comment, req.body.user_id, req.body.post_id, req.body.username, req.body.cid]

  client.query(`UPDATE comments SET
              comment = $1, user_id = $2, post_id = $3, auther = $4, date_created=NOW()
              WHERE cid=$5`, values,
              (q_err, q_res ) => {
                  res.json(q_res.rows)
                  console.log(q_err)
      })
})


router.delete('/api/delete/comment', (req, res, next) => {
  const cid = req.body.cid

  client.query(`DELETE FROM comments
              WHERE cid=$1`, [ cid ],
              (q_err, q_res ) => {
                  res.json(q_res.rows)
                  console.log(q_err)
      })
})


router.get('/api/get/allpostcomments', (req, res, next) => {
  const post_id = String(req.query.post_id)
  console.log(post_id)
  client.query(`SELECT * FROM comments
              WHERE post_id=$1`, [ post_id ],
              (q_err, q_res ) => {
                  console.log(q_res)
                  res.json(q_res.rows)
                  console.log(q_err)
      })
})

/*
  USER PROFILE SECTION
*/

router.post('/api/posts/userprofiletodb', (req, res, next) => {
  const values = [req.body.profile.nickname, req.body.profile.email, req.body.profile.email_verified]
  client.query(`INSERT INTO users(username, email, email_verified, date_created)
              VALUES($1, $2, $3, NOW())
              ON CONFLICT DO NOTHING`, values,
              (q_err, q_res) => {
                res.json(q_res.rows)
      })
} )

router.get('/api/get/userprofilefromdb', (req, res, next) => {
  const email = req.query.email
  console.log(email)
  client.query(`SELECT * FROM users
              WHERE email=$1`, [ email ],
              (q_err, q_res) => {
                res.json(q_res.rows)
      })
} )

router.get('/api/get/userposts', (req, res, next) => {
  const user_id = req.query.user_id
  console.log(user_id)
  client.query(`SELECT * FROM posts
              WHERE user_id=$1`, [ user_id ],
              (q_err, q_res) => {
                  console.log(res.json(q_res))
                // res.json(q_res.rows)
      })
} )


router.put('/api/put/likes', (req, res, next) => {
  const id = [req.body.id]
  const post_id = String(req.body.post_id)

  const values = [ id, post_id ]
  console.log(values)
  client.query(`UPDATE posts
              SET like_user_id = like_user_id || $1, likes = likes + 1
              WHERE NOT (like_user_id @> $1)
              AND pid = ($2)`,
     values, (q_err, q_res) => {
    if (q_err) return next(q_err);
    console.log(q_res)
    res.json(q_res.rows);
  });
});


//Search Posts
router.get('/api/get/searchpost', (req, res, next) => {
  const search_query = String(req.query.search_query)
  console.log(search_query)
  console.log('dfgdf')
  client.query(`SELECT * FROM posts
              WHERE search_vector @@ to_tsquery($1)`,
    [ search_query ], (q_err, q_res) => {
    if (q_err) return next(q_err);
    res.json(q_res.rows);
  });
});

// //Save posts to db
router.post('/api/post/posttodb', (req, res, next) => {
    const body_vector = String(req.body.body)
    const title_vector = String(req.body.title)
    const username_vector = String(req.body.username)
  
    const search_vector = [title_vector, body_vector, username_vector]
    const values = [req.body.title, req.body.body, search_vector, req.body.uid, req.body.username]
    client.query(`INSERT INTO
                posts(title, body, search_vector, user_id, auther, date_created)
                VALUES($1, $2, to_tsvector($3), $4, $5, NOW())`,
      values, (q_err, q_res) => {
      if (q_err) return next(q_err);
      res.json(q_res.rows);
    });
  });


/* Retrieve another users profile from db based on username */
router.get('/api/get/otheruserprofilefromdb', (req, res, next) => {
  // const email = [ "%" + req.query.email + "%"]
  const username = String(req.query.username)
  client.query(`SELECT * FROM users
              WHERE username = $1`,
    [ username ], (q_err, q_res) => {
    res.json(q_res.rows)
  });
});

//Get another user's posts based on username
router.get('/api/get/otheruserposts', (req, res, next) => {
  const username = String(req.query.username)
  client.query(`SELECT * FROM posts
              WHERE auther = $1`,
    [ username ], (q_err, q_res) => {
    res.json(q_res.rows)
  });
});

//Send Message to db
router.post('/api/post/messagetodb', (req, res, next) => {

  const from_username = String(req.body.message_sender)
  const to_username = String(req.body.message_to)
  const title = String(req.body.title)
  const body = String(req.body.body)

  const values = [from_username, to_username, title, body]
  client.query(`INSERT INTO messages(message_sender, message_to, message_title, message_body, date_created)
              VALUES($1, $2, $3, $4, NOW())`,
    values, (q_err, q_res) => {
    if (q_err) return next(q_err);
    console.log(q_res)
    res.json(q_res.rows);
  });
});

//Get another user's posts based on username
router.get('/api/get/usermessages', (req, res, next) => {
  const username = String(req.query.username)
  console.log(username)
  client.query(`SELECT * FROM messages
              WHERE message_to = $1`,
    [ username ], (q_err, q_res) => {
    res.json(q_res.rows)
  });
});

//Delete a message with the message id
router.delete('/api/delete/usermessage', (req, res, next) => {
  const mid = req.body.mid
  client.query(`DELETE FROM messages
              WHERE mid = $1`,
    [ mid ], (q_err, q_res) => {
    if (q_err) return next(q_err);
    console.log(q_res)
    res.json(q_res.rows);
  });
});


module.exports = router


