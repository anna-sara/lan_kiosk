import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, SetStateAction, useState } from 'react';
import axios from 'axios';
import Customer from './Customer';


interface CustomerProps {
    customers: [{
        id: number
        name: string
        customer_group_id: string,
        is_in_group: boolean
    }],
};

type Customer = {
    id: number
    name: string
    customer_group_id: string,
    is_in_group: boolean
    
};

interface CustomerGroupProps {
    groups: [{
        name: string,
        id: number,
        customers: [{
            id: number
            name: string
            customer_group_id: string,
            is_in_group: boolean
        }],
    }]
};

type CustomerGroup = {
    name: string,
    id: number,
    customers: [{
        id: number
        name: string
        customer_group_id: string,
        is_in_group: boolean
    }],
};

type FormInputs = {
    id: number | null;
    customers: Customer[],
    group_name: string,
};

interface CurrentGroup {
    id?: number | null ;
    name?: string;
}

export default function CustomerGroups({groups, customers} :( CustomerGroupProps & CustomerProps) ) {
    const [addCustomerToGroupModal, setAddCustomerToGroupModal] = useState(false);
    const [currentGroup, setCurrentGroup] = useState<CurrentGroup>({id: null, name: ""});
    const [searchItemGroup, setSearchItemGroup] = useState('');
    const [searchItemCustomers, setSearchItemCustomers] = useState('')
    const [searchItemCustomersAddToGroup, setSearchItemCustomersAddToGroup] = useState('')
    const [uniqueGroupNameError, setUniqueGroupNameError,] = useState(false)
    const [activeTabLetter, setActiveTabLetter] = useState('')
    const [activeTab, setActiveTab] = useState('groups')
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers)
    const [filteredCustomersAddToGroup, setFilteredCustomersAddToGroup] = useState<Customer[]>(customers)
    const [filteredGroups, setFilteredGroups] = useState<CustomerGroup[]>(groups)
    const [checkboxes, setCheckboxes] = useState<any[]>([]);
    const [checkboxesAddToGroup, setCheckboxesAddToGroup] = useState<any[]>([]);
    const letterArray = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","Å","Ä","Ö"];

    const { data, setData, post, processing, errors, reset }  = useForm<FormInputs>({
            id: null,
            group_name: "",
            customers: []
    });

    //Group
    const handleInputChangeCreateGroup = (e: any) => { 
        const searchTerm = e.target.value;
        setSearchItemCustomers(searchTerm)

        const filteredItems = customers.filter((customer) =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setFilteredCustomers(filteredItems);
    }

    const submitGroup: FormEventHandler = (e : any) => {
        e.preventDefault()
        let submit = true;
        groups.map( group => {
            if (data.group_name.toLowerCase() === group.name.toLowerCase()) {
                setUniqueGroupNameError(true);
                submit = false;
            }
        })

        if (submit) {
            post(route('register_customer_group'), {
                onFinish: () => [setData(
                    'group_name', '',

                ), setCheckboxes([]),
                window.location.href = "/customer-groups"],
                
            }); 
        }
    }

     const handleInputChangeGroup = (e: any) => { 
        const searchTerm = e.target.value;
        setSearchItemGroup(searchTerm)

        const filteredItems = groups.filter((customer) =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setFilteredGroups(filteredItems);
    }
    

    const handleInputClick = (searchTerm: string) => { 
        const filteredItems = groups.filter((customer) =>
            customer.name.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
        
        setFilteredGroups(filteredItems);
    }

    const handleCheckBoxChange = (e: any) => { 
        let index  = e.target.dataset.id;
        let prev = checkboxes;
        let itemIndex = prev.indexOf(index);
        if (itemIndex !== -1) {
            prev.splice(itemIndex, 1);
        } else {
            prev.push(index);
        }
        setCheckboxes([...prev]);
        setData('customers', checkboxes)
    }

    const deleteCustomerGroup = (id: string | number | undefined) => {
       axios.delete('/api/customer-group/' + id)
        .then(response => {
            window.location.href = "/customer-groups";
        })
        .catch(error => {console.log(error)})
    }

    // Add to group
    const handleInputChangeAddToGroup = (e: any) => { 
        const searchTerm = e.target.value;
        setSearchItemCustomersAddToGroup(searchTerm)

        const filteredItems = customers.filter((customer) =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setFilteredCustomersAddToGroup(filteredItems);
    }

    const addToGroup = (id: number | null | undefined) => {
       axios.post('/api/add-to-customer-group/' + id, {customers: data.customers})
        .then(response => {
            window.location.href = "/customer-groups";
        })
        .catch(error => {console.log(error)})
    }
    
    const handleCheckBoxChangeAddToGroup = (e: any) => { 
        let index  = e.target.dataset.id;
        let prev = checkboxesAddToGroup;
        let itemIndex = prev.indexOf(index);
        if (itemIndex !== -1) {
            prev.splice(itemIndex, 1);
        } else {
            prev.push(index);
        }
        setCheckboxesAddToGroup([...prev]);
        setData('customers', checkboxesAddToGroup)
    }
    
    const deleteCustomerFromGroup = (id: string | number) => {
       axios.put('/api/customer/' + id)
        .then(response => {
            window.location.href = "/customer-groups";
        })
        .catch(error => {console.log(error)})
    }

 
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            { addCustomerToGroupModal && 
            <div className='add-customer-to-group-modal'>
                    <div className='add-customer-to-group-modal-content'> 
                        <button onClick={() => setAddCustomerToGroupModal(false)} className="delete is-large" aria-label="close"></button>
                        <form className='container is-centered'>
                            <h2  className="mt-4 title is-3" >Lägg till deltagare i grupp {currentGroup.name}</h2>
                            <div className='customers-list is-flex is-flex-direction-column gap-3 container is-centered my-4'>
                                {filteredCustomersAddToGroup && filteredCustomersAddToGroup
                                    .map( customer => {
                                    return <label className='checkbox'>
                                        <input type="checkbox" className='mr-2' data-id={customer.id} onClick={handleCheckBoxChangeAddToGroup}/>
                                        {customer.name}
                                    </label>
                                })}
                            </div>
                            <input
                                className='input'
                                type="text"
                                value={searchItemCustomersAddToGroup}
                                onChange={handleInputChangeAddToGroup}
                                placeholder='Skriv för att söka deltagare/funktionär'
                            />
                            <div className='is-flex mt-3'>
                                <span className='mr-2 has-text-weight-bold'>Valda deltagare/funktionärer: </span>
                                {filteredCustomersAddToGroup && filteredCustomersAddToGroup
                                    .filter((filteredCustomer) => checkboxesAddToGroup.includes("" + filteredCustomer.id))
                                    .map( customer => {
                                    return  <p key={customer.id} className='mr-2 tag'>
                                            {customer.name}
                                        </p>
                                    
                                })}
                            </div>
                            <button onClick={() => addToGroup(currentGroup.id)} className="button mt-4 is-small is-white">Lägg till deltagare</button>
                        </form>
                </div>
            </div>
            } 
            <section className='section'>
                <div className="container is-max-desktop">
                    <a href="/dashboard" className="button mb-5 is-small is-white">Tillbaka</a>
                    <div className="tabs is-centered is-boxed">
                        <ul>
                            <li className={activeTab === "groups" ? "is-active" : ""}>
                                <a onClick={() => setActiveTab('groups') }>
                                    <span>Grupper</span>
                                </a>
                            </li>
                            <li className={activeTab === "create-group" ? "is-active" : ""}>
                                <a onClick={() => setActiveTab('create-group') }>
                                    <span>Skapa grupp</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    {activeTab === "create-group" && <>
                        <h2 className="title is-2">Skapa grupp</h2>
                        <div className='create-group-container mb-7'>
                            <div>
                            <form onSubmit={submitGroup} className='container is-centered'>
                                <p className="mb-4">Namn på grupp:</p>
                                <TextInput
                                    required
                                    className="input" 
                                    type="text" 
                                    name="group_name" 
                                    value={data.group_name}
                                    placeholder="Namn på grupp"
                                    min={0}
                                    //max={customer.group_name_left}
                                    onChange={(e) => setData('group_name', e.target.value)}
                                />
                                {uniqueGroupNameError && <p>Gruppnamn är inte unikt</p>}

                                <p  className="mt-4" >Välj vilka som ska ingå i gruppen:</p>
                                
                                <div className='customers-list is-flex is-flex-direction-column gap-3 container is-centered my-4'>
                                    {filteredCustomers && filteredCustomers
                                        .map( customer => {
                                        return <label key={customer.id} className='checkbox'>
                                            <input type="checkbox" className='mr-2' data-id={customer.id} onClick={handleCheckBoxChange}/>
                                            {customer.name}
                                        </label>
                                    })}
                                </div>
                                <input
                                    className='input'
                                    type="text"
                                    value={searchItemCustomers}
                                    onChange={handleInputChangeCreateGroup}
                                    placeholder='Skriv för att söka deltagare/funktionär'
                                />
                            <div className='is-flex mt-3'>
                                    <span className='mr-2 has-text-weight-bold'>Valda deltagare/funktionärer: </span>
                                    {filteredCustomers && filteredCustomers
                                        .filter((filteredCustomer) => checkboxes.includes("" + filteredCustomer.id))
                                        .map( customer => {
                                        return  <p key={customer.id} className='mr-2 tag'>
                                                {customer.name}
                                            </p>
                                        
                                    })}
                                </div>
                                <button className="button mt-4 is-small is-white">Skapa grupp</button>
                            </form>
                        </div>
                        </div>
                    </>
                    }

                    { activeTab === "groups" && <>
                      <h2 className="title is-2">Grupper</h2>
                    <input
                        className='input my-4'
                        type="text"
                        value={searchItemGroup}
                        onChange={handleInputChangeGroup}
                        placeholder='Skriv för att söka'
                    />
                    <div>
                    <ul className='grid is-col-min-2 is-column-gap-1 mb-5'>
                        { letterArray && letterArray.map( letter => {
                             return <li className={`${activeTabLetter == letter ? "is-active" : ""} cell button letter is-small is-white`} onClick={ () => [setActiveTabLetter(letter) ,handleInputClick(letter)]}>
                                 {letter}
                             </li>
                            })
                        }
                        <li className='cell button is-small is-white' onClick={ () => [setActiveTabLetter(""), setFilteredGroups(groups), setSearchItemGroup("") ]}>
                                 Rensa
                        </li>
                           
                        </ul>
                    </div>
                    <div className='container is-centered'>
                       
                        {filteredGroups && filteredGroups.map( group => {
                            return <details className="box">
                                 <summary className='title is-4 my-3'>
                                    <span>{group.name}</span>
                                    <div className="summary-chevron-up">
			                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-chevron-down">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
		                            </div>
                                </summary>
                               
                                 { group.customers.length < 2  &&
                                    <button onClick={() => deleteCustomerGroup(group.id)} className="button is-danger is-outlined is-small">
                                        <span>Ta bort grupp</span>
                                    </button>
                                }
                                <ul>
                                    { group.customers.length > 0 && group.customers.filter((customer) => customer.is_in_group).map( customer => {
                                        return <div className='is-flex gap-4 border-b p-2 is-justify-content-space-between'>
                                                <p className="is-size-5">{customer.name}</p>
                                                <button onClick={() => deleteCustomerFromGroup(customer.id)} className="button is-danger is-outlined is-small">
                                                    <span>Ta bort från grupp</span>
                                                </button>
                                            </div>
                                    })}
                                    
                                </ul>
                                <button className="button mt-4 is-small is-white" onClick={() => [setAddCustomerToGroupModal(true), setCurrentGroup({id: group.id, name: group.name})]}>Lägg till deltagare</button>
                                <div className="summary-chevron-down">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-chevron-up">
                                        <polyline points="18 15 12 9 6 15"></polyline>
                                    </svg>
                                </div>
                            </details>
                        })}
                    </div>
                    </>

                    }
                    
                  
                </div>
            </section>
            
        </AuthenticatedLayout>
    );
}
