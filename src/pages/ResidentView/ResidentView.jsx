import ResidentGreeting from "../../components/ResidentGreeting/ResidentGreeting"
import ViewCard from "../../components/ViewCard/ViewCard";

export default function ResidentView(){
    return <>
    <ResidentGreeting/>
    <section className="card-grid">
        <ViewCard/>
    </section>
    </>
}
