
import { Head } from '@inertiajs/react';

export default function Thankyou() {

   
    return (
        <div>
            <Head title="Tack" />
            <section className='section'>
                <div className="container is-max-desktop">
                    <div className="box px-5 py-5">
                        <h1 className="title px-3 py-3">Tack! Deltagaren är registrerad</h1>
                        <p className="subtitle is-5 px-3 py-3">Swisha in en önskad summa pengar och meddela kioskpersonal eller betala in en önskad summa pengar i kontanter till kioskpersonal.</p>
                        <a className='button' href="swish://">Öppna swish</a>
                    </div>
                </div>
            </section>

        </div>
    );
}
