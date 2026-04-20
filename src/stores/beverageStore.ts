import { defineStore } from "pinia";
import {
  BaseBeverageType,
  CreamerType,
  SyrupType,
  BeverageType,
} from "../types/beverage";
import tempretures from "../data/tempretures.json";
import db from "../firebase.ts";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import type { User } from "firebase/auth";

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: tempretures,
    currentTemp: tempretures[0],
    bases: [] as BaseBeverageType[],
    currentBase: null as BaseBeverageType | null,
    syrups: [] as SyrupType[],
    currentSyrup: null as SyrupType | null,
    creamers: [] as CreamerType[],
    currentCreamer: null as CreamerType | null,
    beverages: [] as BeverageType[],
    currentBeverage: null as BeverageType | null,
    currentName: "",
    user: null as User | null,
    unsubscribe: null as null | (() => void),
    message: "",
  }),

  actions: {
    async init() {
      const baseSelection = await getDocs(collection(db, "bases"));
      this.bases = baseSelection.docs.map(
        (doc) => doc.data() as BaseBeverageType
      );

      const syrupSelection = await getDocs(collection(db, "syrups"));
      this.syrups = syrupSelection.docs.map(
        (doc) => doc.data() as SyrupType
      );

      const creamerSelection = await getDocs(collection(db, "creamers"));
      this.creamers = creamerSelection.docs.map(
        (doc) => doc.data() as CreamerType
      );

      this.currentBase = this.bases[0] ?? null;
      this.currentSyrup = this.syrups[0] ?? null;
      this.currentCreamer = this.creamers[0] ?? null;
    },

    setUser(user: User | null) {
      this.user = user;
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }
      if (!user) {
        this.beverages = [];
        this.currentBeverage = null;
        return;
      }
      const beveragesQuery = query(
        collection(db, "beverages"),
        where("uid", "==", user.uid)
      );
      this.unsubscribe = onSnapshot(beveragesQuery, (snapshot) => {
        this.beverages = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<BeverageType, "id">),
        }));

        this.currentBeverage = this.beverages[0] ?? null;
      });
    },
    async makeBeverage() {
      if (!this.user) {
        this.message = "Please log in to create a beverage.";
        setTimeout(() => {
          this.message = "";
        }, 3000);
        return this.message;
      }
      if (!this.currentBase || !this.currentCreamer || !this.currentSyrup) return;
      if (!this.currentName.trim()) return;

      const newDrink = {
        uid: this.user.uid,
        name: this.currentName,
        temp: this.currentTemp,
        base: this.currentBase,
        creamer: this.currentCreamer,
        syrup: this.currentSyrup,
      };

      const newDocRef = doc(collection(db, "beverages"));
      await setDoc(newDocRef, newDrink);

      this.message = `Beverage "${this.currentName.trim()}" saved successfully!`;
      setTimeout(() => {
        this.message = "";
      }, 3000);
      this.currentName = "";
    },

    showBeverage(beverage: BeverageType) {
      this.currentBeverage = beverage;
      this.currentName = beverage.name;
      this.currentTemp = beverage.temp;
      this.currentBase = beverage.base;
      this.currentCreamer = beverage.creamer;
      this.currentSyrup = beverage.syrup;
    },
  },
});
