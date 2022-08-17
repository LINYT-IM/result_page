firebase.initializeApp({
  databaseURL: "https://or-game-2ef8c-default-rtdb.firebaseio.com/",
});
const DOMobj = {
  table: document.querySelector(".tb-Knapsack"),
  table_TSP: document.querySelector(".tb-TSP"),
  reset_Knap: document.querySelector(".ui.button.Knapsack"),
  reset_TSP: document.querySelector(".ui.button.TSP"),
};
const KnapsackKey = [
  "apple",
  "bananas",
  "strawberry",
  "lemon",
  "watermelon",
  "milk",
];

// function sortArray() {}
function updateTable(obj, avg_gap, table, sortTyp, clear = false) {
  console.log(Object.entries(avg_gap).sort((a, b) => a[1] - b[1]));
  let sortable = [];
  if (sortTyp == "max") {
    arr = Object.entries(avg_gap).sort((a, b) => b[1] - a[1]);
  } else {
    arr = Object.entries(avg_gap).sort((a, b) => a[1] - b[1]);
  }
  for (let i = 0; i < arr.length; i++) {
    sortable.push(arr[i][0]);
  }
  let tbText =
    "<thead><tr><th>Problem</th><th>ID</th><th>Objective Value</th><th>Solution</th><th>Gap(%)</th></tr></thead>";
  // if (prob == "TSP") {
  for (let n in sortable) {
    let i = sortable[n];
    if (obj[i]["name"] == "TSP") {
      tbText += `<tr><td>${obj[i]["name"]}</td><td>${obj[i]["id"]}</td><td>${obj[i]["val"]}</td><td>${obj[i]["sol"]}</td><td>${obj[i]["gap"]}</td></tr>`;
    } else if (obj[i]["name"] == "KNP") {
      let sollist = "";
      for (let j in obj[i]["sol"]) {
        sollist += `${KnapsackKey[j]}:${obj[i]["sol"][j]}, `;
      }
      tbText += `<tr><td>${obj[i]["name"]}</td><td>${obj[i]["id"]}</td><td>${obj[i]["val"]}</td><td>${sollist}</td><td>${obj[i]["gap"]}</td></tr>`;
    }
  }
  // } else if (prob == "Knapsack") {
  //   for (let i in sortable) {
  //     let sollist = "";
  //     for (let j in sol[i]) {
  //       sollist += `${KnapsackKey[j]}:${sol[i][j]}, `;
  //     }
  //     tbText += `<tr><td>${i}</td><td>${val[i]}</td><td>${sollist}</td></tr>`;
  //   }
  // }
  if (clear) {
    tbText = "";
  }
  table.innerHTML = tbText;
}
const database = firebase.database();

const ref = database.ref("/");
ref.on(
  "value",
  (snapshot) => {
    // console.log(snapshot.val());
    let index = 0;
    obj = snapshot.val();
    let totalObj = {};
    let personal_g = {};
    let gaps = {};
    if ("Knapsack" in obj) {
      for (let i in obj["Knapsack"]["gap"]) {
        personal_g[i] = [obj["Knapsack"]["gap"][i]];
        totalObj[index] = {
          id: i,
          name: "KNP",
          gap: obj["Knapsack"]["gap"][i],
          sol: obj["Knapsack"]["sol"][i],
          val: obj["Knapsack"]["val"][i],
        };
        gaps[index] = obj["Knapsack"]["gap"][i];
        index += 1;
      }
    }
    if ("TSP" in obj) {
      for (let i in obj["TSP"]["gap"]) {
        if (i in personal_g) {
          personal_g[i].push(obj["TSP"]["gap"][i]);
        } else {
          personal_g[i] = [obj["TSP"]["gap"][i]];
        }
        totalObj[index] = {
          id: i,
          name: "TSP",
          gap: obj["TSP"]["gap"][i],
          sol: obj["TSP"]["sol"][i],
          val: obj["TSP"]["val"][i],
        };
        gaps[index] = obj["TSP"]["gap"][i];
        index += 1;
      }
    }
    // console.log(totalObj);
    // let avg_gap = {};
    // let avg;
    // for (let i in personal_g) {
    //   avg = 0;
    //   for (let j in personal_g[i]) {
    //     avg += personal_g[i][j];
    //   }
    //   avg_gap[i] = avg / personal_g[i].length;
    // }
    // console.log(avg_gap);
    updateTable(totalObj, gaps, DOMobj.table, "min");
  },
  (errorObject) => {
    console.log("The read failed: " + errorObject.name);
  }
);
// database.ref("/Knapsack").on("value", (e) => {
//   if (e.val() != null && e.val() !== undefined) {
//     updateTable(e.val(), DOMobj.table, "max", "Knapsack");
//   }
// });
// database.ref("/TSP").on("value", (e) => {
//   if (e.val() != null) {
//     // console.log(e.val());
//     updateTable(e.val(), DOMobj.table_TSP, "min", "TSP");
//   }
// });
DOMobj.reset_Knap.addEventListener("click", () => {
  firebase.database().ref("/Knapsack").remove();
  firebase.database().ref("/TSP").remove();
  updateTable({}, {}, DOMobj.table, "max", true);
});
// DOMobj.reset_TSP.addEventListener("click", () => {
//   firebase.database().ref("/TSP").remove();
//   updateTable(e.val(), DOMobj.table_TSP, "min", "TSP", true);
// });
