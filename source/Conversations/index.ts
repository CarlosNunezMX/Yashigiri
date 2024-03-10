import { Manager } from '../Flow/Manager.js'; 
import { FlowSaludo } from './Saludo/index.js';


const manager = Manager.getInstance();


console.log("Installed flows");


// Setting
manager.useEventDisbler('conversation');

// Setting Flows
manager.addFlow(FlowSaludo);