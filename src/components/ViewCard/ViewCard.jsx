import './ViewCard.css'

export default function ViewCard({ label, value }){
    return <>
    <div className="view-card">
        <span className='view-card-label'>{label}</span>
        <span className='view-card-value'>{value}</span>
    </div>
    </>
}
