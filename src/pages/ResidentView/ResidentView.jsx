import ResidentGreeting from "../../components/ResidentGreeting/ResidentGreeting"
import ViewCard from "../../components/View/ViewCard";
import Sidebar from "./Sidebar/Sidebar";

export default function ResidentView(){
    return <>
    <ResidentGreeting></ResidentGreeting>
    <Sidebar/>
    <div className="card-grid">
    <ViewCard/>
    <ViewCard/>
    </div>
    </>
}