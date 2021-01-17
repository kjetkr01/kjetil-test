async function displayApiKey() {

      if (info.apikey) {

         listTitle.innerHTML = "Din API Key er:<hr>";

         const config = {
            method: "GET",
            headers: {
               "content-type": "application/json"
            }
         }

         list.innerHTML = "<tr>";

         list.innerHTML += `
            <td>${info.apikey}
            <br>
            <br>
            Liste med alle APIer:</td>
            `;

         const response = await fetch("/api", config);
         const data = await response.json();

         if (data) {
            for (let i = 0; i < data.length; i++) {
               list.innerHTML += `
               <td>${data[i]}</td>
               `;
            }

            list.innerHTML += "</tr>";
         } else {
            list.innerHTML += errorLoadingText;
         }



      }

   }