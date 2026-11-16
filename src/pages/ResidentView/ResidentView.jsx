import ResidentGreeting from "../../components/ResidentGreeting/ResidentGreeting"
import ViewCard from "../../components/View/ViewCard";
import Sidebar from "./Sidebar/Sidebar";
import './ResidentView.css'

export default function ResidentView(){
    return <>
    <ResidentGreeting></ResidentGreeting>
    <div className="layout">
    <Sidebar/>
    <div className="card-grid">
    <ViewCard/>
    <ViewCard/>
    </div>
    </div>
    </>
}