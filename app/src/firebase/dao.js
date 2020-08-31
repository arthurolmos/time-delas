import * as firebase from "firebase";

const dao = {
  async getDocument(ref) {
    const resp = await ref.get().catch((err) => {
      "ERROR ON GETTING DOCUMENT", err;
    });

    if (resp.exists) {
      const doc = resp.data();
      doc.id = resp.id;

      return doc;
    }

    return null;
  },

  async getCollection(ref) {
    const snapshot = await ref.get().catch((err) => {
      "ERROR ON GETTING COLLECTION", err;
    });

    const docs = [];
    await snapshot.forEach((doc) => {
      const item = doc.data();
      item.id = doc.id;

      docs.push(item);
    });

    return docs;
  },

  async addDocument(ref, data) {
    data._createdAt = firebase.firestore.FieldValue.serverTimestamp();
    data._updatedAt = firebase.firestore.FieldValue.serverTimestamp();

    const docRef = await ref.add(data).catch((err) => {
      "ERROR ON ADDING DOCUMENT", err;
    });

    return docRef.id;
  },

  async setDocumentWithId(ref, data) {
    data._createdAt = firebase.firestore.FieldValue.serverTimestamp();
    data._updatedAt = firebase.firestore.FieldValue.serverTimestamp();

    const docRef = await ref.set(data).catch((err) => {
      "ERROR ON SETTING DOCUMENT WITH ID", err;
    });

    return docRef.id;
  },

  async updateDocument(ref, data) {
    data._updatedAt = firebase.firestore.FieldValue.serverTimestamp();

    await ref.update(data);
  },
};

export default dao;
