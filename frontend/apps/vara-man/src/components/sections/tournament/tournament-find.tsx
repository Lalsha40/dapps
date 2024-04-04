import { useState } from 'react';
import { Input, Button } from '@gear-js/vara-ui';
import { useNavigate } from 'react-router-dom';

import { useApp } from '@/app/context/ctx-app';
import { useGameMessage } from '@/app/hooks/use-game';
import { useGame } from '@/app/context/ctx-game';
import { GameFindModal } from '@/feature/tournament-game/components/modals/game-find';
import { GameNotFoundModal } from '@/feature/tournament-game/components/modals/game-not-found';
import { decodeAddress, encodeAddress } from '@gear-js/api';

type findGame = {
	admin: string,
	bid: bigint,
	participants: number
}

export const TournamentFind = () => {
	const [findAddress, setFindAddress] = useState('')
	const [findGame, setFindGame] = useState<findGame>()
	const [isOpenFindModal, setIsOpenFindModal] = useState(false)
	const [isOpenNotFound, setIsOpenNotFound] = useState(false)

	const navigate = useNavigate()
	const { isPending, setIsPending } = useApp();
	const { allGames } = useGame()
	const handleMessage = useGameMessage();

	const onSuccess = () => {
		setIsPending(false);
		navigate('/')
	};
	const onError = () => {
		setIsPending(false);
	};

	const onSearchGame = () => {
		if (findAddress) {
			const findGame = allGames?.find(game => {
				return game[0] === findAddress || encodeAddress(game[0]) === findAddress
			})
			if (findGame) {
				setIsOpenFindModal(true)
				setFindGame({
					admin: decodeAddress(findAddress),
					bid: findGame?.[1].bid,
					participants: findGame[1].participants.length
				})
			} else {
				setIsOpenNotFound(true)
			}
		}
	}

	const handleSubmit = () => {
		setIsPending(true);

		handleMessage({
			payload: {
				CreateNewTournament: null
			},
			onSuccess,
			onError,
		});

	};

	return (
		<div className="flex flex-col gap-5 justify-center items-center grow h-full">
			{isOpenFindModal && findGame && <GameFindModal findGame={findGame} setIsOpenFindModal={setIsOpenFindModal} />}
			{isOpenNotFound && <GameNotFoundModal setIsOpenFindModal={setIsOpenNotFound} />}

			<h2 className="typo-h2">Find a private game</h2>
			<p>To find the game, you need to enter the administrator's address.</p>

			<form onSubmit={handleSubmit} className="grid gap-4 w-full max-w-[600px] mx-auto mt-5">
				<div className="flex flex-col gap-10">

					<Input
						type="text"
						label='Specify the game admin address:'
						placeholder='0x25c...'
						required
						className="w-full"
						onChange={(e) => setFindAddress(e.target.value)}
					/>

					<div className="flex gap-5">
						<Button color='grey' text='Back' className="w-full" onClick={() => navigate(-1)} isLoading={isPending} />
						<Button text='Continue' className="w-full" isLoading={isPending} onClick={onSearchGame} />
					</div>
				</div>
			</form>
		</div>
	)
}