import ResidentGreeting from "../../components/ResidentGreeting/ResidentGreeting"
import ViewCard from "../../components/View/ViewCard";
import Sidebar from "./Sidebar/Sidebar";
import './ResidentView.css'

export default function ResidentView(){
    return <>
    <div className="resident-layout">
        <Sidebar/>
        <main className="resident-main">
            <ResidentGreeting/>
            <section className="card-grid">
                <ViewCard/>
            </section>
        </main>
    </div>
    </>
}
