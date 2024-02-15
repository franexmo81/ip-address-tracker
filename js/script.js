const map = L.map("map").setView([0, 0], 1);
const form = document.querySelector(".ipForm");
const userInput = document.querySelector(".ipForm__input");
const searchBtn = document.querySelector(".ipForm__btn");
const collapseBtn = document.querySelector(".ipInfo__collapse-btn");
const myIcon = L.icon({
  iconUrl: "images/icon-location.svg",
  iconAnchor: [23, 56],
  popupAnchor: [0, -60],
});

collapseBtn.addEventListener("click", toggleCollapseIpInfo);
userInput.addEventListener("input", checkUserInput);

startWebsite();

async function startWebsite() {
  // Loads map and updates page with user's IP data
  loadMap();
  updatePage(await getUserIp(), `Your IP Adress: <br>${await getUserIp()}`);
}

function submitInput(e) {
  // Prevents form default behaviour, calls updatePage with the input value and cleans the input value
  e.preventDefault();
  updatePage(userInput.value, userInput.value);
  userInput.value = "";
}

async function updatePage(input, tag) {
  // Calls 'getDataFromApi' and updates the page with the data it returns
  const dataFromApi = await getDataFromApi(input, validateUserInput(input));
  updateMap([dataFromApi.location.lat, dataFromApi.location.lng], tag);
  updateIpInfo(
    dataFromApi.ip,
    dataFromApi.location.country,
    dataFromApi.location.region,
    dataFromApi.location.city,
    dataFromApi.location.timezone,
    dataFromApi.isp
  );
  checkUserInput();
}

async function getDataFromApi(input, inputType) {
  // Gets data from API based on inputType (can be ip or domain)

  //Beginning of obfuscated apiKey
  function _0x4bb8(_0x1775c8, _0xf38b) {
    const _0x388de1 = _0x388d();
    return (
      (_0x4bb8 = function (_0x4bb867, _0x11362a) {
        _0x4bb867 = _0x4bb867 - 0x1e9;
        let _0x2e2881 = _0x388de1[_0x4bb867];
        return _0x2e2881;
      }),
      _0x4bb8(_0x1775c8, _0xf38b)
    );
  }
  const _0x2f206a = _0x4bb8;
  function _0x388d() {
    const _0x3f9a98 = [
      "8561dxNbqv",
      "2034avxLCo",
      "4604592HcacYO",
      "641946hUPlZD",
      "1000078Tpqdkm",
      "at_qNQMx1K2cNCUzf5K9bySQMwOabimw",
      "6129430hLcIOT",
      "101636KOaPlJ",
      "660648AStGZv",
    ];
    _0x388d = function () {
      return _0x3f9a98;
    };
    return _0x388d();
  }
  (function (_0x4d9706, _0x1df690) {
    const _0x49f17e = _0x4bb8,
      _0x51b6e9 = _0x4d9706();
    while (!![]) {
      try {
        const _0x1e93ac =
          parseInt(_0x49f17e(0x1f0)) / 0x1 +
          -parseInt(_0x49f17e(0x1ea)) / 0x2 +
          -parseInt(_0x49f17e(0x1ef)) / 0x3 +
          parseInt(_0x49f17e(0x1eb)) / 0x4 +
          -parseInt(_0x49f17e(0x1e9)) / 0x5 +
          (parseInt(_0x49f17e(0x1ed)) / 0x6) *
            (parseInt(_0x49f17e(0x1ec)) / 0x7) +
          parseInt(_0x49f17e(0x1ee)) / 0x8;
        if (_0x1e93ac === _0x1df690) break;
        else _0x51b6e9["push"](_0x51b6e9["shift"]());
      } catch (_0x197032) {
        _0x51b6e9["push"](_0x51b6e9["shift"]());
      }
    }
  })(_0x388d, 0xa2495);

  let apiKey = _0x2f206a(0x1f1);
  //End of obfuscated apiKey

  let apiUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&${inputType}=${input}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      alert("Oops, something went wrong ☹");
    }
  } catch (error) {
    console.log(error);
    alert("Oops, something went wrong ☹");
  }
}

function updateMap(coordinates, info) {
  // Updates map position and adds a marker
  L.marker(coordinates, { alt: info, icon: myIcon })
    .addTo(map)
    .bindPopup(info)
    .openPopup();
  setTimeout(function () {
    map.flyTo(coordinates, 10);
  }, 500);
}

function updateIpInfo(ip, country, region, city, timezone, isp) {
  // Updates info on panel
  const infoIp = document.getElementById("ipInfo-ip");
  const infoLocation = document.getElementById("ipInfo-location");
  const infoTimezone = document.getElementById("ipInfo-timezone");
  const infoIsp = document.getElementById("ipInfo-isp");

  updateInfoElement(infoIp, ip);
  updateInfoElement(infoLocation, `${city}, ${region} (${country})`);
  updateInfoElement(infoTimezone, `UTC ${timezone}`);
  updateInfoElement(infoIsp, isp);
}

function loadMap() {
  // Loads the map on the website
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  L.control.scale().addTo(map);
}

function updateInfoElement(element, content) {
  // Updates info on panel elements
  element.style.opacity = "0";
  setTimeout(() => {
    element.innerText = content;
    element.style.opacity = "1";
  }, 500);
}

function checkUserInput() {
  // Manages form button visibility and form submit event based on whether the input is valid or not
  if (validateUserInput(userInput.value)) {
    searchBtn.classList.add("ipForm__btn--active");
    form.addEventListener("submit", submitInput);
    form.removeEventListener("submit", doNotSubmit);
  } else {
    searchBtn.classList.remove("ipForm__btn--active");
    form.removeEventListener("submit", submitInput);
    form.addEventListener("submit", doNotSubmit);
  }
}

function doNotSubmit(e) {
  // Just prevents form default behaviour
  e.preventDefault();
}

function validateUserInput(input) {
  // Validate whether the input is an ip, a domain or not valid
  if (validateIPAddress(input)) {
    return "ipAddress";
  }

  if (validateDomain(input)) {
    return "domain";
  }
  return false;
}

function validateIPAddress(ip) {
  // Checks if the input is a valid ip
  // Regular expression for IPv4
  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
  // Regular expression for IPv6
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)$/;

  if (ipv4Regex.test(ip) || ipv6Regex.test(ip)) {
    return true;
  } else {
    return false;
  }
}

function validateDomain(domain) {
  // Checks if the input is a valid domain
  // Regular expression for validating domain names
  var domainRegex =
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

  return domainRegex.test(domain);
}

function toggleCollapseIpInfo() {
  // toggles collapsed or expanded view for the panel
  document.querySelector(".ipInfo").classList.toggle("ipInfo--moveUp");
}

async function getUserIp() {
  // It gets user's IP
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    if (response.ok) {
      return data.ip;
    } else {
      alert("Sorry, we couldn't get your IP address ☹");
    }
  } catch (error) {
    console.log(error);
    alert("Sorry, we couldn't get your IP address ☹");
  }
}
