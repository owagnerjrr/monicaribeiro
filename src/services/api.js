import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export async function criarAgendamento(data) {
  console.log("🔥 INICIOU FUNÇÃO");

  try {
    console.log("🔥 DB OK:", db);
    console.log("🔥 DADOS RECEBIDOS:", data);

    const docRef = await addDoc(collection(db, "appointments"), {
      ...data,
      status: "pending",
      createdAt: new Date(),
    });

    console.log("🔥 SALVOU COM ID:", docRef.id);

    return docRef.id;

  } catch (error) {
    console.error("🔥 ERRO REAL:", error);
    throw error;
  }
}