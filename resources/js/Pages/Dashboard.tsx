import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'


interface CustomerProps {
    customers: [{
        id: number
        name: string
    }],
};

interface Customer {
    id: number
    name: string
};



export default function Dashboard({customers}: CustomerProps) {
    const [searchItem, setSearchItem] = useState('')
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers)

    const handleInputChange = (e: any) => { 
        const searchTerm = e.target.value;
        setSearchItem(searchTerm)

        const filteredItems = customers.filter((customer) =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setFilteredCustomers(filteredItems);
    }

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <section className='section'>
                <div className="container is-max-desktop">
                    <h1 className="title is-2">Deltagare</h1>
                        <input
                            className='input my-4'
                            type="text"
                            value={searchItem}
                            onChange={handleInputChange}
                            placeholder='Skriv för att söka'
                        />
                        <div className='container is-centered'>
                            {filteredCustomers && filteredCustomers.map( customer => {
                                return <a key={customer.id} className="box is-flex is-justify-content-space-between" href={`/customer/` + customer.id}>
                                    <p>{customer.name}</p>
                                    <span className="icon has-text-black">
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </span>
                                </a>
                            })}
                        </div>
                   
                
                </div>
            </section>
            
        </AuthenticatedLayout>
    );
}
