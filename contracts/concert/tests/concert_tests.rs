use gear_lib_old::multitoken::io::*;
use gstd::{prelude::*, ActorId, String};

mod utils;
use utils::*;

#[test]
fn create_concert() {
    let system = init_system();
    let concert_program = init_concert(&system);
    create(
        &concert_program,
        USER.into(),
        String::from("Sum 41"),
        String::from("Sum 41 concert in Madrid. 26/08/2022"),
        NUMBER_OF_TICKETS,
        DATE,
        CONCERT_ID,
    );

    check_current_concert(
        &concert_program,
        String::from("Sum 41"),
        String::from("Sum 41 concert in Madrid. 26/08/2022"),
        DATE,
        NUMBER_OF_TICKETS,
        // since no tickets are bought so far
        NUMBER_OF_TICKETS,
    )
}

#[test]
fn buy_tickets() {
    let system = init_system();
    let concert_program = init_concert(&system);
    create(
        &concert_program,
        USER.into(),
        String::from("Sum 41"),
        String::from("Sum 41 concert in Madrid. 26/08/2022"),
        NUMBER_OF_TICKETS,
        DATE,
        CONCERT_ID,
    );

    let metadata = vec![Some(TokenMetadata {
        title: Some(String::from("Sum 41 concert in Madrid 26/08/2022")),
        description: Some(String::from(
            "Sum 41 Madrid 26/08/2022 Ticket. Row 4. Seat 4.",
        )),
        media: Some(String::from("sum41.com")),
        reference: Some(String::from("UNKNOWN")),
    })];

    buy(
        &concert_program,
        CONCERT_ID,
        AMOUNT,
        metadata.clone(),
        false,
    );
    check_buyers(&concert_program, vec![ActorId::from(USER)]);
    check_user_tickets(&concert_program, ActorId::from(USER), metadata);
}

#[test]
fn buy_tickets_failures() {
    let system = init_system();
    let concert_program = init_concert(&system);
    create(
        &concert_program,
        USER.into(),
        String::from("Sum 41"),
        String::from("Sum 41 concert in Madrid. 26/08/2022"),
        NUMBER_OF_TICKETS,
        DATE,
        CONCERT_ID,
    );

    // MUST FAIL since we're buying < 1 ticket
    buy(&concert_program, CONCERT_ID, 0, vec![None], true);

    // MUST FAIL since we're buying more tickets than there are
    buy(
        &concert_program,
        CONCERT_ID,
        NUMBER_OF_TICKETS + 1,
        vec![None; (NUMBER_OF_TICKETS + 1) as usize],
        true,
    );

    // MUST FAIL since metadata is not provided for all tickets
    buy(
        &concert_program,
        CONCERT_ID,
        AMOUNT + 3,
        vec![None; (AMOUNT + 1) as usize],
        true,
    );
}

#[test]
fn hold_concert() {
    let system = init_system();
    let concert_program = init_concert(&system);

    create(
        &concert_program,
        USER.into(),
        String::from("Sum 41"),
        String::from("Sum 41 concert in Madrid. 26/08/2022"),
        NUMBER_OF_TICKETS,
        DATE,
        CONCERT_ID,
    );

    let metadata = vec![Some(TokenMetadata {
        title: Some(String::from("Sum 41 concert in Madrid 26/08/2022")),
        description: Some(String::from(
            "Sum 41 Madrid 26/08/2022 Ticket. Row 4. Seat 4.",
        )),
        media: Some(String::from("sum41.com")),
        reference: Some(String::from("UNKNOWN")),
    })];

    buy(&concert_program, CONCERT_ID, AMOUNT, metadata, false);

    hold(&concert_program, CONCERT_ID);
}
