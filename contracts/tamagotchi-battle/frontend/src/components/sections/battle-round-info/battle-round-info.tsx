import { TamagotchiBattleInfoCard } from '../../tamagotchi/tamagotchi-battle-info-card';
import { useBattle } from 'app/context';
import { BattleStateResponse } from 'app/types/battles';
import { Icon } from '../../ui/icon';

export const BattleRoundInfo = ({ battle }: { battle: BattleStateResponse }) => {
  const { players, currentPlayer } = useBattle();
  return (
    <div className="relative flex gap-10 justify-between mt-4 xl:mt-7">
      <div className="basis-[445px] flex justify-center">
        <TamagotchiBattleInfoCard tamagotchi={players[0]} isActive={players[0].tmgId === currentPlayer} />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="border border-white/10 bg-white/[3%] backdrop-blur-md p-6 pt-5 rounded-2xl font-kanit text-base text-white/60 tracking-wider">
          <h3 className="font-normal text-center">
            Participants:{' '}
            <b className="inline-block ml-1 text-xl font-semibold text-white">{Object.keys(battle.players).length}</b>
          </h3>
          <div className="flex items-center gap-12 mt-4">
            <div className="flex items-center gap-2">
              <Icon name="participants-alive" className="w-6 h-6 shrink-0" />
              <p className="flex items-center">
                Alive:{' '}
                <b className="inline-block ml-1 text-xl font-semibold text-white">
                  {Object.values(battle.players).filter((el) => el.health).length}
                </b>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="participants-dead" className="w-6 h-6 shrink-0" />
              <p className="flex items-center">
                Dead:{' '}
                <b className="inline-block ml-1 text-xl font-semibold text-white">
                  {Object.values(battle.players).filter((el) => !el.health).length}
                </b>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="basis-[445px] flex justify-center">
        <TamagotchiBattleInfoCard tamagotchi={players[1]} isActive={players[1].tmgId === currentPlayer} />
      </div>
    </div>
  );
};
