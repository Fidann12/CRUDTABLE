const tbody = document.querySelector("tbody");
const student__plus = document.querySelector("#student__plus");
const mark__plus = document.querySelector("#mark__plus");
const student__modal = document.querySelector(".student__modal");
const mark__modal = document.querySelector(".mark__modal");
const student__list = document.querySelector("#student__list");
const addBtn = document.querySelector(".add");
let chart = null;
const initalData = [];
let students = [];
let marks = [];
let student = {
  id: new Date().getTime(),
  name: "",
  surname: "",
};
let initalMark = {
  id: new Date().getTime(),
  mark: 0,
  student_id: null,
};
student__modal.addEventListener("click", () => {
  student__modal.classList.remove("active");
});
student__plus.addEventListener("click", () => {
  student__modal.classList.add("active");
});
mark__plus.addEventListener("click", () => {
  if (!students.length) {
    return;
  }
  mark__modal.classList.add("active");
});
mark__modal.addEventListener("click", () => {
  mark__modal.classList.remove("active");
});
[...document.querySelectorAll("form")].map((a) => {
  a.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  a.addEventListener("submit", (e) => {
    e.preventDefault();
    if (e.target.parentElement.classList.contains("student__modal")) {
      students.push(student);
      student = {
        id: new Date().getTime(),
        name: "",
        surname: "",
      };
      [...e.target.querySelectorAll("input")].map((a) => (a.value = ""));
    } else {
      initalMark = { ...initalMark, student_id: student__list.value };
      marks.push(initalMark);
      initalMark = {
        id: new Date().getTime(),
        mark: 0,
        student_id: null,
      };
      e.target.querySelector("input").value = 0;
    }
    e.target.parentElement.classList.remove("active");
    showStudents();
  });
});
[...student__modal.querySelectorAll("input")].map((a) => {
  a.addEventListener("input", (e) => {
    student = { ...student, [e.target.name]: e.target.value };
  });
});
mark__modal.querySelector("input").addEventListener("input", (e) => {
  initalMark = { ...initalMark, mark: +e.target.value };
});
const showStudents = () => {
  tbody.innerHTML = "";
  student__list.innerHTML = "";
  let averages = [];
  students.map((a) => {
    let option = document.createElement("option");
    option.textContent = `${a.name} ${a.surname}`;
    option.value = a.id;
    student__list.append(option);
    let tr = document.createElement("tr");
    let nameTd = document.createElement("td");
    nameTd.textContent = `${a.name} ${a.surname}`;
    let markTd = document.createElement("td");
    let studentMarks = marks
      .filter((t) => +t.student_id === +a.id)
      .map((t) => t.mark);
    markTd.textContent = studentMarks.length ? studentMarks : "Qiymət yoxdur";
    let aveTd = document.createElement("td");
    let sum = studentMarks.reduce((acc, item) => acc + item, 0);
    aveTd.textContent = studentMarks.length
      ? (sum / studentMarks.length).toFixed(2)
      : 0;
    const operationsTd = document.createElement("td");
    const saveBtn = document.createElement("button");
    saveBtn.addEventListener("click", saveData);
    saveBtn.classList.add("add");
    const editBtn = document.createElement("button");
    editBtn.textContent = "edit";
    editBtn.classList.add("edit");
    editBtn.addEventListener("click", editData);
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "delete";
    cancelBtn.addEventListener("click", deleteRow);
    cancelBtn.classList.add("cancel");
    operationsTd.append(cancelBtn, editBtn);
    averages.push(+aveTd.textContent);
    tr.append(nameTd, markTd, aveTd, operationsTd);
    tbody.append(tr);
  });
  if (!chart) {
    chart = new Chart(document.getElementById("bar-chart"), {
      type: "bar",
      data: {
        labels: students.map((a) => `${a.name}.${a.surname.charAt(0)}`),
        datasets: [
          {
            label: "Ortalama",
            backgroundColor: "#3e95cd",
            data: averages,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: "Qiymətlər",
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  } else {
    chart.data.labels = [
      ...students.map((a) => `${a.name}.${a.surname.charAt(0)}`),
    ];
    chart.data.datasets = [
      {
        label: "Ortalama",
        backgroundColor: "#3e95cd",
        data: averages,
      },
    ];
    averages.sort((a, b) => b - a);
    console.log(chart.data.datasets);
    chart.update();
  }
};
const deleteRow = (e) => {
  e.target.closest("tr").remove();
};
const cancelEdit = (e) => {
  const row = e.target.closest("tr");
  const cells = [...row.querySelectorAll("td")].slice(0, 2);
  initalData.map((a, b) => (cells[b].textContent = a));
  e.target.previousElementSibling.textContent = "Düzəliş et";
  e.target.previousElementSibling.classList.remove("add");
  e.target.previousElementSibling.classList.add("edit");
  e.target.previousElementSibling.removeEventListener("click", editData);
  e.target.addEventListener("click", saveData);
  e.target.textContent = "Sil";
  e.target.removeEventListener("click", cancelEdit);
  e.target.addEventListener("click", deleteRow);
};
const editData = (e) => {
  e.target.textContent = "Yadda Saxla";
  e.target.classList.remove("edit");
  e.target.classList.add("add");
  e.target.removeEventListener("click", editData);
  e.target.addEventListener("click", saveData);
  const row = e.target.closest("tr");
  const cells = [...row.querySelectorAll("td")].slice(0, 2);
  cells.map((cell, key) => {
    initalData[key] = cell.textContent;
    const input = document.createElement("input");
    input.setAttribute("type", key === 2 ? "number" : "text");
    input.value = cell.textContent;
    cell.textContent = "";
    cell.append(input);
  });
};
// const saveData = (e) => {
//   const inputs = [...document.querySelectorAll("input")];
//   inputs.map((input) => {
//     input.closest.textContent = input.value;
//   });
//   e.target.textContent = "Düzəliş et";
//   e.target.classList.remove("add");
//   e.target.classList.add("edit");
//   e.target.removeEventListener("click", saveData);
//   e.target.addEventListener("click", editData);
// };
// const editData = (e) => {
//   e.target.classList.remove("edit");
//   e.target.classList.add("add");
//   e.target.removeEventListener("click", editData);
//   e.target.addEventListener("click", saveData);
//   const row = e.target.closest("tr");
//   const cells = [...row.querySelectorAll("td")].slice(0, 2);
//   cells.map((cell, key) => {
//     initalData[key] = cell.textContent;
//     const input = document.createElement("input");
//     input.setAttribute("type", key === 2 ? "number" : "text");
//     input.value = cell.textContent;
//     cell.textContent = "";
//     cell.append(input);
//   });
// };
// const saveData = (e) => {
//   const inputs = [...document.querySelectorAll("input")];
//   inputs.map((input) => {
//     input.parentElement.textContent = input.value;
//   });
//   e.target.classList.remove("add");
//   e.target.classList.add("edit");
//   e.target.removeEventListener("click", saveData);
//   e.target.addEventListener("click", editData);
// };
const saveData = (e) => {
  const inputs = [...document.querySelectorAll("input")];
  inputs.map((input) => {
    input.closest.textContent = input.value;
  });
  const row = e.target.closest("tr");
  const cells = [...row.querySelectorAll("td")].slice(0, 2);
  cells.map((cell, key) => {
    const input = cell.querySelector("input");
    const newValue = input.value;
    cell.textContent = newValue;
    initalData[key] = newValue;
  });
  e.target.textContent = "Düzəliş et";

  e.target.classList.remove("add");
  e.target.classList.add("edit");
  e.target.removeEventListener("click", saveData);
  e.target.addEventListener("click", editData);
};
