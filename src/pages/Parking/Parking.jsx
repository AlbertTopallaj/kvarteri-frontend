import { useApp } from '../../context/AppContext';
import '../../styles/ResidentPages.css'
import './Parking.css'

const GROUPS = [
    { kind: 'parking', title: 'Parkeringar' },
    { kind: 'garage', title: 'Garage' },
];

export default function Parking(){
    const { parkingSpots, joinQueue, leaveQueue } = useApp();


    function renterText(spot){
        if (!spot.renterId) return 'Ledig';
        const renter = spot.renter;
        if (!renter) return 'Hyrs av borttagen användare';
        return `${renter.name}${renter.apartment ? ` (lgh ${renter.apartment})` : ''}`;
    }

    return <>
    <header className="page-header">
        <h1>Parkering</h1>
        <p>Parkeringar och garage hyrs tillsvidare. Ställ dig i kö för den plats du vill ha.</p>
    </header>

    {GROUPS.map(group => {
        const spots = parkingSpots.filter(s => s.kind === group.kind);
        return (
            <section key={group.kind} className="panel">
                <h2>{group.title}</h2>
                {spots.length === 0
                    ? <p className="empty-state">Inga platser.</p>
                    : <ul className="row-list">
                        {spots.map(spot => {
                            const queue = spot.queue;
                            const position = spot.myQueuePosition;
                            const isRenter = spot.mine;
                            return (
                                <li key={spot.id} className="review-item">
                                    <div className="review-body">
                                        <div className="row-title">{spot.name}</div>
                                        <div className="row-meta">
                                            {spot.renterId ? 'Hyrs av' : 'Status'}: {renterText(spot)}
                                        </div>
                                        <div className="row-meta">
                                            {spot.price} kr/mån · {queue.length === 0 ? 'Ingen kö' : `${queue.length} i kö`}
                                        </div>
                                    </div>
                                    <div className="review-side">
                                        <span className={`badge ${spot.renterId ? 'progress' : 'done'}`}>
                                            {spot.renterId ? 'Uthyrd' : 'Ledig'}
                                        </span>
                                        {isRenter
                                            ? <span className="row-meta">Din plats</span>
                                            : position > 0
                                                ? <div className="row-actions">
                                                    <span className="row-meta">Din köplats: {position}</span>
                                                    <button type="button" className="btn sm secondary" onClick={() => leaveQueue(spot.id)}>
                                                        Lämna kön
                                                    </button>
                                                </div>
                                                : <button type="button" className="btn sm" onClick={() => joinQueue(spot.id)}>
                                                    Ställ dig i kö
                                                </button>
                                        }
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                }
            </section>
        );
    })}
    </>
}
