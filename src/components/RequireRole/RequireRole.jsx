import { Navigate, Outlet } from 'react-router';
import { useApp } from '../../context/AppContext';
import { ROLE_HOME } from '../../utils/roles';

// Släpper bara in inloggade användare med rätt roll. Administratörer har tillgång överallt.
export default function RequireRole({ roles }){
    const { user } = useApp();

    if (!user) return <Navigate to="/" replace/>;
    if (user.role !== 'admin' && !roles.includes(user.role)){
        return <Navigate to={ROLE_HOME[user.role]} replace/>;
    }
    return <Outlet/>;
}
