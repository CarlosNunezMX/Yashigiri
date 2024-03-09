import { WhiteList } from '../Flow/Lists.js';
import { Manager } from '../Flow/Manager.js'; 
import { FlowSaludo } from './Saludo/index.js';


const manager = Manager.getInstance();


console.log("Installed flows");


// Whitelist
const justhisbronum = new WhiteList();
justhisbronum.addToList() // fill it! with your number ''
// Setting
manager.useEventDisbler('conversation');
manager.useWhiteList(justhisbronum);

// Setting Flows
manager.addFlow(FlowSaludo);