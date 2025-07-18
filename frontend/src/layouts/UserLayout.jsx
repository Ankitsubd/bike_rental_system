import {Navbar ,Footer} from '../components';

const UserLayout =({children})=>{
    return(
        <div className='min-h-screen flex flex-col'>
            <Navbar/>
            <main className='flex-grow container mx-auto px-4 py-6'>
                {children}
            </main>
            <Footer/>
        </div>
    )
};

export default UserLayout;