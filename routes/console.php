<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Storage;
use App\Models\Customer;
use App\Models\Tableversion;
 
Schedule::call(function () {

    $latestVersionParticipant = Tableversion::where('table', 'participants')->latest()->first();
    $latestVersionVolunteer = Tableversion::where('table', 'volunteers')->latest()->first();

    $client = new Client();

    $responseVersions= $client->request(
        'GET',
         config('app.apilan_url') . "version",
        [
            'headers'=> [
                'X-Api-Key' => config('app.apilan_key'), 
                'Accept' => 'application/json',
                'Content-Type' => 'application/json'
            ],
            'cert' => config('app.apilan_clientcert_path') 
            //'cert' => Storage::disk('public')->path('lan.vbytes.se.pem')
        ],
    );
    $versions = json_decode((string) $responseVersions->getBody(), true);

     if ($latestVersionParticipant === null ) { 
        Tableversion::create([
            'table' => 'participants',
            'version' => $versions['participants'] - 1,
        ]);
        $latestVersionParticipant = Tableversion::where('table', 'participants')->latest()->first();
    }

    if ( $latestVersionVolunteer === null ) { 
        Tableversion::create([
            'table' => 'volunteers',
            'version' => $versions['volunteers'] - 1,
        ]);
        $latestVersionVolunteer = Tableversion::where('table', 'volunteers')->latest()->first();
    }

   
    if($latestVersionParticipant->version < $versions['participants']  || $latestVersionVolunteer->version < $versions['volunteers'] ) {
        $response = $client->request(
            'GET',
             config('app.apilan_url') . "data",
            [
                'headers'=> [
                    'X-Api-Key' => config('app.apilan_key'), 
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json'
                ],
                'cert' => config('app.apilan_clientcert_path') 
                //'cert' => Storage::disk('public')->path('lan.vbytes.se.pem')
            ],
        );
        $response_data = json_decode((string) $response->getBody(), true);

        foreach ($response_data['participants'] as $participant) {
            Customer::updateOrCreate(
                ['lan_id' => $participant['lan_id']], 
                [
                    'lan_id' => $participant['lan_id'],
                    'name' => $participant['first_name'] . " " . $participant['surname'],        
                    'guardian_name' => $participant['guardian_name'],
                ]
            );
        }
        
        foreach ($response_data['volunteers'] as $volunteer) {
            Customer::updateOrCreate(
                ['lan_id' => $volunteer['lan_id']], 
                [
                    'lan_id' => $volunteer['lan_id'],
                    'name' => $volunteer['first_name'] . " " . $volunteer['surname'],          
                    'guardian_name' => $participant['guardian_name'],
                ]
            );
        }

        
        if($latestVersionParticipant->version < $versions['participants']) {
            Tableversion::create([
                'table' => 'participants',
                'version' =>$latestVersionParticipant->version + 1,
            ]);
        }
      
        if($latestVersionVolunteer->version < $versions['volunteers']) {
            Tableversion::create([
                'table' => 'volunteers',
                'version' =>$latestVersionVolunteer->version + 1,
            ]);
        }
    
    }
})->everyMinute();
