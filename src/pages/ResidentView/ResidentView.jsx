import ResidentGreeting from "../../components/ResidentGreeting/ResidentGreeting"
import ViewCard from "../../components/View/ViewCard";
import Sidebar from "./Sidebar/Sidebar";
import './ResidentView.css'

export default function ResidentView(){
    return <>
    <div className="layout">
    <Sidebar/>
    <div className="main">
    <ResidentGreeting></ResidentGreeting>
    <div className="card-grid">
    <ViewCard/>
    </div>
    </div>
    </div>
    </>
}