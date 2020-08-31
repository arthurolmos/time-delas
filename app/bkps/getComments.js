commentsRef.onSnapshot((snapshot) => {
  const comments = [];

  snapshot.forEach((doc) => {
    const comment = doc.data();
    comment.id = doc.id;

    comments.push(comment);
  });

  for (let i = 0; i < comments.length; i++) {
    const userId = comments[i].postedBy;
    const userRef = db.collection("users").doc(userId);

    const user = await dao.getDocument(userRef);
    if (user) {
      comments[i].src = user.photoURL;
      comments[i].fullName = user.firstName + " " + user.lastName;
    }
  }

  setPostComments([...comments]);
});








commentsRef
      .onSnapshot((snapshot) => {
        const comments = [];

        snapshot.forEach((doc) => {
          const comment = doc.data();
          comment.id = doc.id;

          comments.push(comment);
        });

        return comments;
      })
      .then(async (comments) => {
        for (let i = 0; i < comments.length; i++) {
          const userId = comments[i].postedBy;
          const userRef = db.collection("users").doc(userId);

          const user = await dao.getDocument(userRef);
          if (user) {
            comments[i].src = user.photoURL;
            comments[i].fullName = user.firstName + " " + user.lastName;
          }
        }
        setPostComments([...comments]);
      });