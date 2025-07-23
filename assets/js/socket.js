let allData = [];
const current_ips = [];
const socket = io();
document.getElementById('filter-input').addEventListener('input', renderFilteredTable);

function row(tr, bgcolour) {
  tr.role = "row";
  tr.className = "odd";
  tr.style.backgroundColor = bgcolour;
}

function insert_data(tr, section, data) {
  section.textContent = data;
  tr.appendChild(section);
}
function createbtn(tr, data) {
  const buttonCell = document.createElement("td");
  const buttonWrapper = document.createElement("div");
  buttonWrapper.style.padding = "20px";
  const btn = document.createElement("button");
  btn.textContent = "Click to view";
  btn.addEventListener("click", () => overlay_on(data));
  buttonWrapper.appendChild(btn);
  buttonCell.appendChild(buttonWrapper);
  tr.appendChild(buttonCell);
}
function iconbtn() {
  return (iconClass, className, attrs = {}) => {
    const a = document.createElement("a");
    a.href = "#";
    a.className = className;
    a.setAttribute("role", "button");
    Object.entries(attrs).forEach(([k, v]) => a.setAttribute(k, v));
    const icon = document.createElement("i");
    icon.className = iconClass;
    a.appendChild(icon);
    return a;
  };
}

function renderFilteredTable() {
  const query = document.getElementById('filter-input').value.toLowerCase();
  const tbody = document.getElementById('log-table-body');
  tbody.innerHTML = '';

  allData.forEach(ipObj => {
    const ip = Object.keys(ipObj)[0];
    const requests = ipObj[ip];

    requests.forEach(req => {
      for (let i = 0; i < req.Method.length; i++) {
        const match = ip.toLowerCase().includes(query) ||
          req.Method[i].toLowerCase().includes(query) ||
          req.Url[i].toLowerCase().includes(query) ||
          JSON.stringify(req.Header[i]).toLowerCase().includes(query);

        const str =  req.Url[i]
        const slashMatches = [...str.matchAll(/\//g)];
        const slashCount = slashMatches.length;
        let bgcolour = 'none'
        if (
          slashCount === 1 ||
          (slashCount === 2 && str.endsWith('/'))) {
          bgcolour='green'
        }
        console.log(req.ContainsXSS[i])
        if (req.ContainsXSS[i]){
          bgcolour='red'
        }
        if (match) {
          let parsed;
          try {
            parsed = JSON.parse(req.Header[i]);
          } catch (err) {
            parsed = { error: "Invalid JSON" };
          }
          
          const data = JSON.stringify(parsed, null, 4);
          const tr = document.createElement("tr");
          row(tr, bgcolour)

          insert_data(tr, document.createElement("td"), ip) //ip

          insert_data(tr, document.createElement("td"), req.Method[i]) //method
      
          insert_data(tr, document.createElement("td"), req.Url[i]) // url

          createbtn(tr, data)

          const xssCell = document.createElement("td");
          xssCell.id = "xss";
          xssCell.textContent = req.ContainsXSS[i];
          tr.appendChild(xssCell);
          
          const actionsCell = document.createElement("td");
          actionsCell.className = "text-center align-middle";
          actionsCell.style.maxHeight = "60px";
          actionsCell.style.height = "60px";
          
          const makeIconButton = iconbtn()
          actionsCell.appendChild(makeIconButton("far fa-eye", "btn btnMaterial btn-flat primary semicircle"));
          actionsCell.appendChild(makeIconButton("fas fa-pen", "btn btnMaterial btn-flat success semicircle"));
          actionsCell.appendChild(makeIconButton("fas fa-trash btnNoBorders", "btn btnMaterial btn-flat accent btnNoBorders checkboxHover", {
            "data-bs-toggle": "modal",
            "data-bs-target": "#delete-modal",
            "style": "margin-left: 5px; color: #DC3545;"
          }));
          
          tr.appendChild(actionsCell);

          tbody.prepend(tr);
          
        }
      }
      current_ips.push(ip);
    });
  });
}
socket.on('network', (data) => {
  console.log('Received data:', data);
  renderTable(data);
});

function overlay_off() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("text").textContent = "";  //  Clear the text
}

function overlay_on(headerData) {
  document.getElementById("text").textContent = headerData;
  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";
  overlay.style.width = "70%";
  document.getElementById("settings").style.display = 'none';
}

function settings() {
  const setting_option = document.getElementById("settings");
  const overlay = document.getElementById("overlay");
  overlay.style.width = "30%";
  overlay.appendChild(setting_option);

  setting_option.style.display = "block"
  overlay.style.display = "block";
}

function renderTable(data) {
  allData = data
  renderFilteredTable();
}
