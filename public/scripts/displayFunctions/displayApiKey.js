async function displayApiKey() {

   if (info.apikey) {

      listTitle.innerHTML = "Liste med alle APIer<hr>";

      const config = {
         method: "GET",
         headers: {
            "content-type": "application/json"
         }
      }

      list.innerHTML = "<tr>";

      const response = await fetch("/api", config);
      const data = await response.json();

      if (data) {
         for (let i = 0; i < data.length; i++) {
            list.innerHTML += `
               <td>${data[i]}</td>
               `;
         }

         document.getElementById("showTotalLift").innerHTML = `Din API Key er:<br> ${info.apikey}`;

         list.innerHTML += "</tr>";
      } else {
         list.innerHTML += errorLoadingText;
      }



   }

}