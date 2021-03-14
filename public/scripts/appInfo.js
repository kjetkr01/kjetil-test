const applicationName = `Treningstatistikken`;

const vMajorVersion = 2; // hvis ny major. minor og revision = 0
const vMinorVersion = 3; // hvis ny minor. revision = 0
const vRevision = 17;
const applicationUpdateDate = "14.03.2021";

const applicationVersionNumber = `${vMajorVersion}.${vMinorVersion}.${vRevision}`;
const applicationVersionState = `alpha`;
const applicationFullVersion = `Versjon ${applicationVersionNumber} (${applicationVersionState})`;



const showOngoingUpdates = true;
const ongoingUpdatesText = "Pågående oppdateringer";
const ongoingUpdates = `
<strong>Innstillinger:</strong>
<br><br>
- Oppdatere: Passord (0%)
<br>
- Oppdatere detaljer: Om deg (0%)
<br>
- Oppdatere Utseende: Tema (0%)
<br>
- Oppdatere Fremgangs info: Størrelse og Informasjon (0%)
`;

const showPlannedUpdates = true;
const plannedUpdatesText = "Kommende oppdateringer";
const plannedUpdates = `
<strong>Treningsplan:</strong>
<br><br>
- Opp til 3 treningsplaner
`;