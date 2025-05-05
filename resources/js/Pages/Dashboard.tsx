import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { SetStateAction, useState } from 'react';
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
    const [activeTab, setActiveTab] = useState('')
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers)
    const letterArray = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","Å","Ä","Ö"];

    const handleInputChange = (e: any) => { 
        const searchTerm = e.target.value;
        setSearchItem(searchTerm)

        const filteredItems = customers.filter((customer) =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setFilteredCustomers(filteredItems);
    }

    const handleInputClick = (searchTerm: any) => { 
        const filteredItems = customers.filter((customer) =>
            customer.name.toLowerCase().startsWith(searchTerm.toLowerCase())
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
                    <div>
                    <ul className='grid is-col-min-2 is-column-gap-1 mb-5'>
                        { letterArray && letterArray.map( letter => {
                             return <li className={`${activeTab == letter ? "is-active" : ""} cell button letter is-small is-white`} onClick={ () => [setActiveTab(letter) ,handleInputClick(letter)]}>
                                 {letter}
                             </li>
                            })
                        }
                        <li className='cell button is-small is-white' onClick={ () => [setActiveTab(""), setFilteredCustomers(customers), setSearchItem("") ]}>
                                 Rensa
                        </li>
                           
                        </ul>
                    </div>
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
