import ResidentGreeting from "../components/ResidentGreeting/ResidentGreeting"
import ViewCard from "../components/View/ViewCard";

export default function ResidentView(){
    return <>
    <ResidentGreeting></ResidentGreeting>
    <div className="card-grid">
    <ViewCard/>
    <ViewCard/>
    </div>
    </>
}