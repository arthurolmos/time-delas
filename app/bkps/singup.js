async function signUp({ email, password, firstName, lastName }) {
  if (email !== "" && password !== "" && firstName !== "" && lastName !== "") {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        const { user } = result;

        return user
          .updateProfile({
            displayName: firstName + " " + lastName,
          })
          .then(() => {
            refreshUser();

            const userRef = firebase
              .firestore()
              .collection("users")
              .doc(user.uid);

            return userRef
              .set({
                email,
                firstName,
                lastName,
              })
              .then(() => {
                return userRef.update({
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                });
              })
              .catch((err) => {
                console.log("ERROR ON SAVING USER IN DB - SIGNUP", err);
              });
          });
      })
      .catch((err) => {
        console.log("ERROR ON CREATING USER - SIGNUP", err);
        Toast.show("ERROR ON CREATING USER");
      });
  } else {
    Toast.show("Preencha os campos corretamente!");
  }
}

async function signUp({ email, password, firstName, lastName }) {
  if (email !== "" && password !== "" && firstName !== "" && lastName !== "") {
    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);

      const { user } = result;
      await user.updateProfile({
        displayName: firstName + " " + lastName,
      });

      refreshUser();

      const userRef = db.collection("users").doc(user.uid);

      await userRef.set({
        email,
        firstName,
        lastName,
      });

      await userRef.update({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } catch (err) {
      console.log("ERROR ON SAVING USER IN DB - SIGNUP", err);
      console.log("ERROR TYPE", err.type);
      Toast.show("Preencha os campos corretamente!");
    }
  } else {
    Toast.show("Preencha os campos corretamente!");
  }
}
