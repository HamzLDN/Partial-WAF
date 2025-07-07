let allData = [];
const current_ips = [];
const socket = io();
document.getElementById('filter-input').addEventListener('input', renderFilteredTable);

function renderFilteredTable() {
  const query = document.getElementById('filter-input').value.toLowerCase();
  const tbody = document.getElementById('log-table-body');
  tbody.innerHTML = '';

  allData.forEach(ipObj => {
    const ip = Object.keys(ipObj)[0];
    const requests = ipObj[ip];

    requests.forEach(req => {
      for (let i = 0; i < req.Method.length; i++) {
        const match =
          ip.toLowerCase().includes(query) ||
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
        if (req.ContainsXSS[i]==='true'){
          bgcolour='red'
        }
        if (match) {
          const parsed = JSON.parse(req.Header[i]);
          const data = JSON.stringify(parsed, null, 4);
          const row = `
          <tr role="row" class='odd' style='background-color: ${bgcolour}'>
            <td>${ip}</td>
            <td>${req.Method[i]}</td>
            <td>${req.Url[i]}</td>
            <td>
              <div style="padding:20px">
              
                <button onclick='overlay_on(${JSON.stringify(data)})'>Click to view</button>
              </div>
            </td>
            <td>${req.ContainsXSS[i]}</td>
            <td>${status_code}</td>
          </tr>
        `;
          tbody.insertAdjacentHTML('afterbegin', row);
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
}

function overlay_on(headerData) {
  document.getElementById("text").textContent = headerData;
  document.getElementById("overlay").style.display = "block";
}

function renderTable(data) {
  allData = data
  renderFilteredTable();
}
