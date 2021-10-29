import { Request, Response } from 'express';
import { UpdatePayload } from './edit-member-detail/editMemberDetailRepository';
import { EditMemberDetailService } from './edit-member-detail/editMemberDetailService';
import { ListAllMembersService } from './list-all-members/listAllMembersService';
import { ShowMemberDetailService } from './show-member-detail/showMemberDetailService';

type Dependencies = {
  listAllMembersService: ListAllMembersService;
  showMemberDetailService: ShowMemberDetailService;
  editMemberDetailService: EditMemberDetailService;
};

export class MembersController {
  private readonly listAllMembersService: ListAllMembersService;
  private readonly showMemberDetailService: ShowMemberDetailService;
  private readonly editMemberDetailService: EditMemberDetailService;

  constructor(deps: Dependencies) {
    this.listAllMembersService = deps.listAllMembersService;
    this.showMemberDetailService = deps.showMemberDetailService;
    this.editMemberDetailService = deps.editMemberDetailService;
  }

  listAllMembers = async (req: Request, res: Response) => {
    const result = await this.listAllMembersService.execute();
    res.json(result);
  };

  showMemberDetail = async (
    req: Request<{ memberId: string }>,
    res: Response
  ) => {
    const result = await this.showMemberDetailService.execute({
      memberId: req.params.memberId,
    });
    res.json(result);
  };

  editMemberDetail = async (
    req: Request<{ memberId: string }, any, UpdatePayload>,
    res: Response
  ) => {
    const { memberId } = req.params;
    const result = await this.editMemberDetailService.execute({
      memberId,
      payload: req.body,
    });
    res.json(result);
  };
}
